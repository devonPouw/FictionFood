package com.portfolio.fictionfood.recipe;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.fictionfood.category.Category;
import com.portfolio.fictionfood.category.CategoryRepository;
import com.portfolio.fictionfood.exception.UnauthorizedException;
import com.portfolio.fictionfood.image.ImageRepository;
import com.portfolio.fictionfood.image.ImageService;
import com.portfolio.fictionfood.ingredient.Ingredient;
import com.portfolio.fictionfood.ingredient.IngredientRepository;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredient;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredientDto;
import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {
    private final IngredientRepository ingredientRepository;
    private final ImageService imageService;
    private final ImageRepository imageRepository;
    private final CategoryRepository categoryRepository;
    private final RecipeRepository recipeRepository;
    private final ObjectMapper objectMapper;

    public RecipeInfoDto getRecipeByIdAndUser(long id, User currentUser) throws UnauthorizedException {
        var recipe = recipeRepository.findById(id).orElseThrow();
        if (currentUser == null || currentUser.getRole().equals(UserRole.CHEF))
            if (!recipe.getAuthor().equals(currentUser) && !recipe.getIsPublished()) {
                throw new UnauthorizedException("User is not authorized to access this recipe");
            }

        byte[] recipeImageData = imageService.downloadImage(recipe.getImage().getName());

        return RecipeInfoDto.builder()
                .id(recipe.getId())
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
    }

    public Map<String, Object> getAllPublishedRecipes(int page, int size) {
        PageRequest paging = PageRequest.of(page, size, Sort.by("datePublished").descending());
        Page<Recipe> pageRecipes = recipeRepository.findByIsPublished(true, paging);

        List<RecipeListDto> recipeDtoList = pageRecipes.getContent().stream().map(recipe -> {
            byte[] imageData = imageService.downloadImage(recipe.getImage().getName());
            return RecipeListDto.builder()
                    .id(recipe.getId())
                    .title(recipe.getTitle())
                    .summary(recipe.getSummary())
                    .categories(recipe.getCategories().stream().map(Category::getName).collect(Collectors.toSet()))
                    .author(recipe.getAuthor().getNickname())
                    .datePublished(recipe.getDatePublished())
                    .rating(recipe.getRating())
                    .imageData(imageData)
                    .build();
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("recipes", recipeDtoList);
        response.put("currentPage", pageRecipes.getNumber());
        response.put("totalItems", pageRecipes.getTotalElements());
        response.put("totalPages", pageRecipes.getTotalPages());

        return response;
    }

    public Recipe postRecipe(String recipeJson, MultipartFile image, User currentUser) throws IOException {
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
                .map(categoryDto -> categoryRepository.findByNameIgnoringCase(categoryDto)
                        .orElseGet(() -> {
                            Category newCategory = new Category();
                            newCategory.setName(categoryDto);
                            return categoryRepository.save(newCategory);
                        }))
                .collect(Collectors.toSet())));
        recipe.setRecipeIngredients(new HashSet<>(Arrays.stream(recipeDto.getRecipeIngredients())
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
                .collect(Collectors.toSet())));

        recipeRepository.save(recipe);
        imageService.uploadImage(image, recipe);
        recipe.setImage(imageRepository.findByRecipe(recipe).orElseThrow());

        return recipeRepository.save(recipe);
    }
}
