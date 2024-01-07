package com.portfolio.fictionfood.recipe;

import com.fasterxml.jackson.annotation.JsonView;
import com.portfolio.fictionfood.category.Category;
import com.portfolio.fictionfood.ingredient.IngredientRepository;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredientRepository;
import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRepository;
import com.portfolio.fictionfood.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recipes")
public class RecipeController {
    @Value("${app.recipe-rules.max-per-month}")
    int maxRecipesPerMonth;
    @Autowired
    private RecipeRepository recipeRepository;
    Function<User, Boolean> hasNotExceededMaxPerMonth = user ->
            recipeRepository.countByAuthorAndDatePublishedAfter(user, LocalDateTime.now().minusMonths(1)) < maxRecipesPerMonth;
    @Autowired
    private IngredientRepository ingredientRepository;
    @Autowired
    private RecipeIngredientRepository recipeIngredientRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> recipeById(@PathVariable("id") long id) {
        var recipe = recipeRepository.findById(id);
        if (recipe.isPresent()) {
            return ResponseEntity.of(recipe);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public Iterable<Recipe> allRecipes() {
        return recipeRepository.findAll();
    }

    @JsonView(RecipeViews.GetRecipeList.class)
    @PostMapping
    public ResponseEntity<Recipe> postRecipe(@Validated @RequestBody RecipeDto recipeDto,
                                             @AuthenticationPrincipal User currentUser) {
        if (!checkIfAllowedToPost(currentUser)) {
            return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
        }

        try {
            var recipe = new Recipe();
            recipe.setTitle(recipeDto.getTitle());
            recipe.setSummary(recipeDto.getSummary());
            recipe.setContent(recipeDto.getContent());
            recipe.setPublished(recipeDto.getPublished());
            recipe.setAuthor(currentUser);
            recipe.setRating(BigDecimal.valueOf(0.0));
            recipe.setDatePublished(LocalDateTime.now());
//                  recipe.setAmountOfReviews(0);
            recipe.setCategory(new HashSet<>(Arrays.stream(recipeDto.getCategories())
                    .map(categoryDto -> {
                        Category category = new Category();
                        category.setName(categoryDto.getName());
                        return category;
                    })
                    .collect(Collectors.toSet())));


            return new ResponseEntity<>(recipeRepository.save(recipe), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    boolean checkIfAllowedToPost(User user) {
        return user.getRole().equals(UserRole.MODERATOR) || (user.getRole().equals(UserRole.CHEF)
                && hasNotExceededMaxPerMonth.apply(user));
    }

    @DeleteMapping("/{id}")
    public void deleteRecipeById(@PathVariable("id") long id) {
        recipeRepository.deleteById(id);
    }

}
