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
import java.util.HashSet;
import java.util.List;
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
//        seedUsers();
        seedRecipes();
    }

    private void seedRecipes() {
        Recipe recipe = new Recipe();
        recipeRepository.save(recipe);

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

        Ingredient ingredient = new Ingredient();
        ingredient.setName("Flour");
        Ingredient ingredient1 = new Ingredient();
        ingredient1.setName("Eggs");

        categoryRepository.saveAll(Set.of(category, category1));
        ingredientRepository.saveAll(Set.of(ingredient, ingredient1));

        RecipeIngredient recipeIngredient = new RecipeIngredient();
        recipeIngredient.setIngredient(ingredient);
        recipeIngredient.setQuantity(500D);
        recipeIngredient.setUnit(Unit.GRAM);

        RecipeIngredient recipeIngredient1 = new RecipeIngredient();
        recipeIngredient1.setIngredient(ingredient1);
        recipeIngredient1.setQuantity(2D);
        recipeIngredient1.setUnit(Unit.PIECE);

        recipeIngredient.setRecipe(recipe);
        recipeIngredient1.setRecipe(recipe);

        recipeIngredientRepository.saveAll(Set.of(recipeIngredient, recipeIngredient1));


        recipe.setTitle("Pasta");
        recipe.setSummary("This pasta is really good");
        recipe.setContent("Still don't believe it? Make it, you donut!");
        recipe.setPublished(Boolean.TRUE);
        recipe.setAuthor(user);
        recipe.setRating(BigDecimal.valueOf(5.0));
        recipe.setDatePublished(LocalDateTime.now());
        recipe.setCategory(Set.of(category, category1));
        recipe.setRecipeIngredients(Set.of(recipeIngredient, recipeIngredient1));

        recipeRepository.save(recipe);
    }

//    private void seedUsers() {
//        userRepository.saveAllAndFlush(List.of(
//                User.builder()
//                        .role(UserRole.MODERATOR)
//                        .nickname("GordonRamsay")
//                        .username("mod")
//                        .email("ramsay@example.com")
//                        .password(passwordEncoder.encode("123"))
//                        .build()
//        ));
//    }
}