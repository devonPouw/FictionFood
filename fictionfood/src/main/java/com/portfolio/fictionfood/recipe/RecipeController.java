package com.portfolio.fictionfood.recipe;

import com.fasterxml.jackson.annotation.JsonView;
import com.portfolio.fictionfood.ingredient.IngredientRepository;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredientRepository;
import com.portfolio.fictionfood.recipeingredient.Unit;
import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRepository;
import com.portfolio.fictionfood.user.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Function;

@RestController
@CrossOrigin
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

    //    @PostMapping
//    public Recipe postRecipe(@RequestBody RecipeDto recipeDto) {
//        var recipe = recipeRepository.save(new Recipe(recipeDto.title));
//        for (RecipeIngredientDto recipeIngredientDto : recipeDto.recipeIngredients()) {
//            Ingredient ingredient = ingredientRepository.findByNameIgnoringCase(recipeIngredientDto.name).orElseThrow();
//            RecipeIngredient recipeIngredient = new RecipeIngredient(recipeIngredientDto.quantity, ingredient, recipe, recipeIngredientDto.unit);
//            recipeIngredientRepository.save(recipeIngredient);
//            recipe.addRecipeIngredient(recipeIngredient);
//        }
//        return recipe;
//    }
    @JsonView(RecipeViews.GetRecipeList.class)
    @PostMapping
    public ResponseEntity<Recipe> postRecipe(@RequestBody RecipeDto recipeDto) {
        try {
            var recipe = new Recipe();
            recipe.setTitle(recipeDto.title);
            recipe.setContent(recipeDto.content);
            recipe.setPublished(recipeDto.published);
            recipe.setAuthor(userRepository.findByUsername("mod").orElseThrow());
            recipe.setRating(BigDecimal.valueOf(0.0));
            recipe.setCategory(Set.of("Disney"));
            recipe.setSummary(recipeDto.content);
            recipe.setAmountOfReviews(0L);
            recipe.setDatePublished(LocalDateTime.now());

        return new ResponseEntity<>(recipeRepository.save(recipe), HttpStatus.CREATED);
    } catch (RuntimeException e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }

//    @JsonView(RecipeViews.GetRecipeList.class)
//    @PostMapping
//    public ResponseEntity<Recipe> postRecipe(@Validated @RequestBody RecipeDto recipeDto,
//                                               @AuthenticationPrincipal User currentUser) {
//        if (!checkIfAllowedToPost(currentUser)) {
//            return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
//        }
//        try {
//            var recipe = new Recipe();
//            recipe.set(recipeDto.status);
//            project.setSummary(recipeDto.summary);
//            project.setContent(recipeDto.content);
//            project.setTitle(recipeDto.title);
//            project.setAuthor(currentUser);
//            project.setDatePublished(LocalDateTime.now());
//            if (currentUser.getRole().equals(UserRole.MUNICIPAL)) {
//                project.setStatus(ProjectStatus.ACTIVE);
//                project.setStartOfVoting(LocalDateTime.now());
//                project.setEndOfVoting(LocalDateTime.now().plusDays(daysVotingActive));
//            } else if (!(project.getAuthor().getRole().equals(UserRole.CHEF)
//                    && (project.getStatus() == ProjectStatus.PROPOSED || project.getStatus() == ProjectStatus.EDITING))) {
//                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//            }
//            return new ResponseEntity<>(recipeRepository.save(recipe), HttpStatus.CREATED);
//        } catch (RuntimeException e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    boolean checkIfAllowedToPost(User user) {
        return user.getRole().equals(UserRole.MODERATOR) || (user.getRole().equals(UserRole.CHEF)
                && hasNotExceededMaxPerMonth.apply(user));
    }

    @DeleteMapping("/{id}")
    public void deleteRecipeById(@PathVariable("id") long id) {
        recipeRepository.deleteById(id);
    }

    public record RecipeIngredientDto(String name, Long ingredientId, Double quantity, Unit unit) {
    }

    public record RecipeDto(String title, String content, Boolean published) {
    }
//    public record RecipeDto(String title, RecipeIngredientDto[] recipeIngredients) {
//    }
}
