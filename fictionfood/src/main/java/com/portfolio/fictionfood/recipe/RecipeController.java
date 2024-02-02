package com.portfolio.fictionfood.recipe;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.fictionfood.authentication.token.TokenRepository;
import com.portfolio.fictionfood.category.Category;
import com.portfolio.fictionfood.category.CategoryRepository;
import com.portfolio.fictionfood.image.ImageRepository;
import com.portfolio.fictionfood.image.ImageService;
import com.portfolio.fictionfood.image.MultipartImage;
import com.portfolio.fictionfood.image.RecipeImage;
import com.portfolio.fictionfood.ingredient.Ingredient;
import com.portfolio.fictionfood.ingredient.IngredientRepository;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredient;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredientDto;
import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recipes")
public class RecipeController {

    private final IngredientRepository ingredientRepository;
    private final ImageService imageService;
    private final ImageRepository imageRepository;
    private final TokenRepository tokenRepository;
    private final ObjectMapper objectMapper;
    @Value("${app.recipe-rules.max-per-month}")
    int maxRecipesPerMonth;
    @Autowired
    private RecipeRepository recipeRepository; //Without @Autowired, Function below will not work.
    Function<User, Boolean> hasNotExceededMaxPerMonth = user ->
            recipeRepository.countByAuthorAndDatePublishedAfter(user, LocalDateTime.now().minusMonths(1)) < maxRecipesPerMonth;
    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/{id}")
    public ResponseEntity<RecipeInfoDto> getRecipeById(@PathVariable("id") long id,
                                                       @AuthenticationPrincipal User currentUser) {
        try {
            var recipe = recipeRepository.findById(id).orElseThrow();
            if (!recipe.getAuthor().equals(currentUser) && !recipe.getIsPublished()) {
                return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
            }
            byte[] recipeImageData = imageService.downloadImage(recipe.getImage().getName());

            var recipeInfo = RecipeInfoDto.builder()
                    .title(recipe.getTitle())
                    .summary(recipe.getSummary())
                    .content(recipe.getContent())
                    .recipeIngredients(recipe.getRecipeIngredients().stream().map(recipeIngredient -> new RecipeIngredientDto(
                            recipeIngredient.getUnit(),
                            recipeIngredient.getQuantity(),
                            recipeIngredient.getIngredient().getName())).collect(Collectors.toSet()))
                    .categories(recipe.getCategories().stream().map(Category::getName).collect(Collectors.toSet()))
                    .author(recipe.getAuthor().getNickname())
                    .recipeImage(recipeImageData)
                    .build();

            return new ResponseEntity<>(recipeInfo, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllRecipes(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        try {
            PageRequest paging = PageRequest.of(page, size, Sort.by("datePublished").descending());
            Page<Recipe> pageRecipes = recipeRepository.findByIsPublished(true, paging);

            List<Recipe> recipes = pageRecipes.getContent();
            List<RecipeListDto> recipeDtos = new ArrayList<>();

            for (Recipe recipe : recipes) {
                byte[] imageData = imageService.downloadImage(recipe.getImage().getName());

                recipeDtos.add(RecipeListDto.builder()
                        .id(recipe.getId())
                        .title(recipe.getTitle())
                        .summary(recipe.getSummary())
                        .categories(recipe.getCategories().stream().map(Category::getName).collect(Collectors.toSet()))
                        .author(recipe.getAuthor().getNickname())
                        .datePublished(recipe.getDatePublished())
                        .rating(recipe.getRating())
                        .imageData(imageData)
                        .build());
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("recipes", recipeDtos);
            responseBody.put("currentPage", pageRecipes.getNumber());
            responseBody.put("totalItems", pageRecipes.getTotalElements());
            responseBody.put("totalPages", pageRecipes.getTotalPages());

            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> postRecipe(@RequestPart("recipe") String recipeJson,
                                             @RequestPart("image") MultipartFile image,
                                             @AuthenticationPrincipal User currentUser) {
        if (!checkIfAllowedToPost(currentUser)) {
            return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
        }

        try {
            PostRecipeDto recipeDto = objectMapper.readValue(recipeJson, PostRecipeDto.class);

            var recipe = new Recipe();
            recipe.setTitle(recipeDto.getTitle());
            recipe.setSummary(recipeDto.getSummary());
            recipe.setContent(recipeDto.getContent());
            recipe.setIsPublished(recipeDto.getIsPublished());
            recipe.setAuthor(currentUser);
            recipe.setRating(BigDecimal.valueOf(0.0));
            recipe.setDatePublished(LocalDateTime.now());
//                  recipe.setAmountOfReviews(0);
            recipe.setCategories(new HashSet<>(Arrays.stream(recipeDto.getCategories())
                    .map(categoryDto -> {
                        Category category = new Category();
                        category.setName(categoryDto);
                        categoryRepository.save(category);
                        return category;
                    })
                    .collect(Collectors.toSet())));
            recipe.setRecipeIngredients(recipeDto.getRecipeIngredients()
                    .stream()
                    .map(recipeIngredientDto -> {
                        RecipeIngredient recipeIngredient = new RecipeIngredient();
                        recipeIngredient.setRecipe(recipe);

                        Ingredient ingredient = ingredientRepository.findByNameIgnoringCase(recipeIngredientDto.getIngredient())
                                .orElseGet(() -> {
                                    Ingredient newIngredient = new Ingredient();
                                    newIngredient.setName(recipeIngredientDto.getIngredient());
                                    ingredientRepository.save(newIngredient);
                                    return newIngredient;
                                });

                        recipeIngredient.setIngredient(ingredient);
                        recipeIngredient.setQuantity(recipeIngredientDto.getQuantity());
                        recipeIngredient.setUnit(recipeIngredientDto.getUnit());

                        return recipeIngredient;
                    })
                    .collect(Collectors.toCollection(HashSet::new)));
            recipeRepository.save(recipe);
            imageService.uploadRecipeImage(image, recipe);
            recipe.setImage(imageRepository.findByRecipe(recipe).orElseThrow());
            return new ResponseEntity<>(recipeRepository.save(recipe), HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteRecipeById(@PathVariable("id") long id) {
        recipeRepository.deleteById(id);
    }

    boolean checkIfAllowedToPost(User user) {
        return user.getRole().equals(UserRole.MODERATOR) || (user.getRole().equals(UserRole.CHEF)
                && hasNotExceededMaxPerMonth.apply(user));
    }
}
