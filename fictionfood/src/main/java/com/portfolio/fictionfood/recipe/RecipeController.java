package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.ingredient.Ingredient;
import com.portfolio.fictionfood.ingredient.IngredientRepository;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredient;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredientRepository;
import com.portfolio.fictionfood.recipeingredient.Unit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/recipes")
public class RecipeController {

    @Autowired
   private RecipeRepository recipeRepository;
    @Autowired
   private IngredientRepository ingredientRepository;
    @Autowired
   private RecipeIngredientRepository recipeIngredientRepository;

    @Value("${app.recipe-rules.max-per-month}")
    int maxRecipesPerMonth;

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

    @PostMapping
    public Recipe postRecipe(@RequestBody RecipeDto recipeDto) {
        var recipe = recipeRepository.save(new Recipe(recipeDto.title));
        for (RecipeIngredientDto recipeIngredientDto : recipeDto.recipeIngredients()) {
            Ingredient ingredient = ingredientRepository.findByNameIgnoringCase(recipeIngredientDto.name).orElseThrow();
            RecipeIngredient recipeIngredient = new RecipeIngredient(recipeIngredientDto.quantity, ingredient, recipe, recipeIngredientDto.unit);
            recipeIngredientRepository.save(recipeIngredient);
            recipe.addRecipeIngredient(recipeIngredient);
        }
        return recipe;
    }

    @DeleteMapping("/{id}")
    public void deleteRecipeById(@PathVariable("id") long id) {
        recipeRepository.deleteById(id);
    }

    record RecipeIngredientDto(String name, long ingredientId, double quantity, Unit unit) {
    }

    record RecipeDto(String title, RecipeIngredientDto[] recipeIngredients) {
    }
}
