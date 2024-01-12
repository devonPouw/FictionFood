package com.portfolio.fictionfood;

import com.portfolio.fictionfood.category.Category;
import com.portfolio.fictionfood.category.CategoryRepository;
import com.portfolio.fictionfood.ingredient.Ingredient;
import com.portfolio.fictionfood.ingredient.IngredientRepository;
import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.recipe.RecipeRepository;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredient;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredientRepository;
import com.portfolio.fictionfood.recipeingredient.Unit;
import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRepository;
import com.portfolio.fictionfood.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@RequiredArgsConstructor
@Component
public class Seeder implements CommandLineRunner {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;

    @Override
    public void run(String... args) throws IOException {
        System.out.println("Seeding database...");
        seedRecipes();
    }

    private void seedRecipes() {
        Recipe recipe = new Recipe();
        Recipe recipe1 = new Recipe();
        Recipe recipe2 = new Recipe();
        recipeRepository.saveAll(Set.of(recipe, recipe1, recipe2));

        User user = new User();
        user.setRole(UserRole.MODERATOR);
        user.setNickname("GordonRamsay");
        user.setUsername("mod");
        user.setEmail("ramsay@example.com");
        user.setPassword(passwordEncoder.encode("123"));
        userRepository.save(user);

        Category category = new Category();
        category.setName("Disney");
        Category category1 = new Category();
        category1.setName("Pixar");
        Category category2 = new Category();
        category2.setName("Lord of the Rings");
        Category category3 = new Category();
        category3.setName("Star Wars");

        Ingredient ingredient = new Ingredient();
        ingredient.setName("Flour");
        Ingredient ingredient1 = new Ingredient();
        ingredient1.setName("Eggs");
        Ingredient ingredient2 = new Ingredient();
        ingredient2.setName("Bacon");
        Ingredient ingredient3 = new Ingredient();
        ingredient3.setName("Milk");
        Ingredient ingredient4 = new Ingredient();
        ingredient4.setName("Steak");
        Ingredient ingredient5 = new Ingredient();
        ingredient5.setName("Gravy");

        categoryRepository.saveAll(Set.of(category, category1, category2, category3));
        ingredientRepository.saveAll(Set.of(ingredient, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5));

        RecipeIngredient recipeIngredient = new RecipeIngredient();
        recipeIngredient.setIngredient(ingredient);
        recipeIngredient.setQuantity(500D);
        recipeIngredient.setUnit(Unit.GRAM);

        RecipeIngredient recipeIngredient1 = new RecipeIngredient();
        recipeIngredient1.setIngredient(ingredient1);
        recipeIngredient1.setQuantity(2D);
        recipeIngredient1.setUnit(Unit.PIECE);

        RecipeIngredient recipeIngredient2 = new RecipeIngredient();
        recipeIngredient2.setIngredient(ingredient2);
        recipeIngredient2.setQuantity(300D);
        recipeIngredient2.setUnit(Unit.GRAM);

        RecipeIngredient recipeIngredient3 = new RecipeIngredient();
        recipeIngredient3.setIngredient(ingredient3);
        recipeIngredient3.setQuantity(100D);
        recipeIngredient3.setUnit(Unit.MILLILITRE);

        RecipeIngredient recipeIngredient4 = new RecipeIngredient();
        recipeIngredient4.setIngredient(ingredient4);
        recipeIngredient4.setQuantity(150D);
        recipeIngredient4.setUnit(Unit.GRAM);

        RecipeIngredient recipeIngredient5 = new RecipeIngredient();
        recipeIngredient5.setIngredient(ingredient5);
        recipeIngredient5.setQuantity(100D);
        recipeIngredient5.setUnit(Unit.MILLILITRE);

        recipeIngredient.setRecipe(recipe);
        recipeIngredient1.setRecipe(recipe);
        recipeIngredient2.setRecipe(recipe1);
        recipeIngredient3.setRecipe(recipe1);
        recipeIngredient4.setRecipe(recipe2);
        recipeIngredient5.setRecipe(recipe2);

        recipeIngredientRepository.saveAll(Set.of(recipeIngredient, recipeIngredient1, recipeIngredient2,
                recipeIngredient3, recipeIngredient4, recipeIngredient5));

        recipe.setTitle("Pasta");
        recipe.setSummary("This pasta is really good");
        recipe.setContent("Still don't believe it? Make it, you donut!");
        recipe.setIsPublished(true);
        recipe.setAuthor(user);
        recipe.setRating(BigDecimal.valueOf(5.0));
        recipe.setDatePublished(LocalDateTime.now());
        recipe.setCategories(Set.of(category, category1));
        recipe.setRecipeIngredients(Set.of(recipeIngredient, recipeIngredient1));
        recipe.setImage(null);

        recipe1.setTitle("Eggs and Bacon");
        recipe1.setSummary("Just like it says");
        recipe1.setContent("Do I need to say more?");
        recipe1.setIsPublished(true);
        recipe1.setAuthor(user);
        recipe1.setRating(BigDecimal.valueOf(4.2));
        recipe1.setDatePublished(LocalDateTime.now().minusSeconds(550));
        recipe1.setCategories(Set.of(category2));
        recipe1.setRecipeIngredients(Set.of(recipeIngredient, recipeIngredient1));
        recipe1.setImage(null);

        recipe2.setTitle("Steak");
        recipe2.setSummary("Not for vegans");
        recipe2.setContent("With some really nice gravy");
        recipe2.setIsPublished(true);
        recipe2.setAuthor(user);
        recipe2.setRating(BigDecimal.valueOf(5.0));
        recipe2.setDatePublished(LocalDateTime.now().minusSeconds(210));
        recipe2.setCategories(Set.of(category, category3));
        recipe2.setRecipeIngredients(Set.of(recipeIngredient, recipeIngredient1));
        recipe2.setImage(null);

        recipeRepository.saveAll(Set.of(recipe, recipe1, recipe2));
    }
}