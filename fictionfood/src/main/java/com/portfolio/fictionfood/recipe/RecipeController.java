package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.authentication.token.TokenRepository;
import com.portfolio.fictionfood.category.Category;
import com.portfolio.fictionfood.image.ImageRepository;
import com.portfolio.fictionfood.image.ImageService;
import com.portfolio.fictionfood.image.RecipeImage;
import com.portfolio.fictionfood.ingredient.Ingredient;
import com.portfolio.fictionfood.ingredient.IngredientRepository;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredient;
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
    @Value("${app.recipe-rules.max-per-month}")
    int maxRecipesPerMonth;
    @Autowired
    private RecipeRepository recipeRepository; //Without @Autowired, Function below will not work.
    Function<User, Boolean> hasNotExceededMaxPerMonth = user ->
            recipeRepository.countByAuthorAndDatePublishedAfter(user, LocalDateTime.now().minusMonths(1)) < maxRecipesPerMonth;

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable("id") long id) {
        try {
            return new ResponseEntity<>(recipeRepository.findByIdAndIsPublished(id, true).orElseThrow(), HttpStatus.OK);
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
    public ResponseEntity<Recipe> postRecipe(@ModelAttribute PostRecipeDto recipeDto,
                                             @AuthenticationPrincipal User currentUser) {
        if (!checkIfAllowedToPost(currentUser)) {
            return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
        }

        try {
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
            String uploadImage = imageService.uploadRecipeImage(recipeDto.getImage(), recipe);
            recipe.setImage((RecipeImage) imageRepository.findByName(uploadImage).orElseThrow());
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
