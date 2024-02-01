package com.portfolio.fictionfood;

import com.portfolio.fictionfood.category.Category;
import com.portfolio.fictionfood.category.CategoryRepository;
import com.portfolio.fictionfood.image.ImageRepository;
import com.portfolio.fictionfood.image.ImageService;
import com.portfolio.fictionfood.ingredient.Ingredient;
import com.portfolio.fictionfood.ingredient.IngredientRepository;
import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.recipe.RecipeRepository;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredient;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredientRepository;
import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRepository;
import com.portfolio.fictionfood.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

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
    private final ImageRepository imageRepository;
    private final ImageService imageService;

    @Override
    public void run(String... args) throws IOException {
        System.out.println("Seeding database...");
        seedRecipes();
    }

    private void seedRecipes() throws IOException {
        var recipe = new Recipe();
        var recipe1 = new Recipe();
        var recipe2 = new Recipe();
        var recipe3 = new Recipe();
        var recipe4 = new Recipe();

        recipeRepository.saveAll(Set.of(recipe, recipe1, recipe2, recipe3, recipe4));

        var user = User.builder()
                .nickname("GordonRamsay")
                .username("mod")
                .email("ramsay@example.com")
                .role(UserRole.MODERATOR)
                .password(passwordEncoder.encode("123"))
                .build();

        userRepository.save(user);

        Category category = new Category();
        category.setName("Disney");
        Category category1 = new Category();
        category1.setName("Pixar");
        Category category2 = new Category();
        category2.setName("Lord of the Rings");
        Category category3 = new Category();
        category3.setName("Star Wars");
        Category category4 = new Category();
        category4.setName("Italian");
        Category category5 = new Category();
        category5.setName("Breakfast");
        Category category6 = new Category();
        category6.setName("Grilled");
        Category category7 = new Category();
        category7.setName("Comfort Food");

        categoryRepository.saveAll(Set.of(category, category1, category2, category3, category4, category5, category6,
                category7));

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
        Ingredient ingredient6 = new Ingredient();
        ingredient6.setName("Tomato Sauce");
        Ingredient ingredient7 = new Ingredient();
        ingredient7.setName("Parmesan Cheese");
        Ingredient ingredient8 = new Ingredient();
        ingredient8.setName("Spaghetti");
        Ingredient ingredient9 = new Ingredient();
        ingredient9.setName("Olive Oil");
        Ingredient ingredient10 = new Ingredient();
        ingredient10.setName("Mozzarella");

        ingredientRepository.saveAll(Set.of(ingredient, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5,
                ingredient6, ingredient7, ingredient8, ingredient9, ingredient10));

        var recipeIngredient = RecipeIngredient.builder()
                .ingredient(ingredient)
                .quantity(500D)
                .unit("gram")
                .recipe(recipe)
                .build();

        var recipeIngredient1 = RecipeIngredient.builder()
                .ingredient(ingredient1)
                .quantity(2D)
                .unit("piece")
                .recipe(recipe)
                .build();

        var recipeIngredient2 = RecipeIngredient.builder()
                .ingredient(ingredient2)
                .quantity(300D)
                .unit("gram")
                .recipe(recipe1)
                .build();

        var recipeIngredient3 = RecipeIngredient.builder()
                .ingredient(ingredient3)
                .quantity(100D)
                .unit("millilitre")
                .recipe(recipe1)
                .build();

        var recipeIngredient4 = RecipeIngredient.builder()
                .ingredient(ingredient4)
                .quantity(150D)
                .unit("gram")
                .recipe(recipe2)
                .build();

        var recipeIngredient5 = RecipeIngredient.builder()
                .ingredient(ingredient5)
                .quantity(100D)
                .unit("millilitre")
                .recipe(recipe2)
                .build();

        var recipeIngredient6 = RecipeIngredient.builder()
                .ingredient(ingredient6)
                .quantity(400D)
                .unit("gram")
                .recipe(recipe3)
                .build();

        var recipeIngredient7 = RecipeIngredient.builder()
                .ingredient(ingredient7)
                .quantity(50D)
                .unit("gram")
                .recipe(recipe3)
                .build();

        var recipeIngredient8 = RecipeIngredient.builder()
                .ingredient(ingredient8)
                .quantity(300D)
                .unit("gram")
                .recipe(recipe3)
                .build();

        var recipeIngredient9 = RecipeIngredient.builder()
                .ingredient(ingredient9)
                .quantity(2D)
                .unit("tablespoon")
                .recipe(recipe3)
                .build();

        var recipeIngredient10 = RecipeIngredient.builder()
                .ingredient(ingredient10)
                .quantity(150D)
                .unit("gram")
                .recipe(recipe3)
                .build();

        recipeIngredientRepository.saveAll(Set.of(recipeIngredient, recipeIngredient1, recipeIngredient2,
                recipeIngredient3, recipeIngredient4, recipeIngredient5, recipeIngredient6, recipeIngredient7,
                recipeIngredient8, recipeIngredient9, recipeIngredient10));

        MultipartFile[] image;
        image = new MultipartFile[]{
                imageService.seedImage("src/pasta.jpg"),
                imageService.seedImage("src/bacon&eggs.jpg"),
                imageService.seedImage("src/steak.jpg"),
                imageService.seedImage("src/spaghetti-bolognese.jpg"),
                imageService.seedImage("src/pizza-margarita.jpg"),
        };

        imageService.uploadRecipeImage(image[0], recipe);
        imageService.uploadRecipeImage(image[1], recipe1);
        imageService.uploadRecipeImage(image[2], recipe2);
        imageService.uploadRecipeImage(image[3], recipe3);
        imageService.uploadRecipeImage(image[4], recipe4);

        recipe.setTitle("Pasta");
        recipe.setSummary("This pasta is really good");
        recipe.setContent("Still don't believe it? Make it, you donut!");
        recipe.setIsPublished(true);
        recipe.setAuthor(user);
        recipe.setRating(BigDecimal.valueOf(5.0));
        recipe.setDatePublished(LocalDateTime.now());
        recipe.setCategories(Set.of(category, category1));
        recipe.setRecipeIngredients(Set.of(recipeIngredient, recipeIngredient1));
        recipe.setImage(imageRepository.findByRecipe(recipe).orElseThrow());

        recipe1.setTitle("Eggs and Bacon");
        recipe1.setSummary("Just like it says");
        recipe1.setContent("Do I need to say more?");
        recipe1.setIsPublished(true);
        recipe1.setAuthor(user);
        recipe1.setRating(BigDecimal.valueOf(4.2));
        recipe1.setDatePublished(LocalDateTime.now().minusSeconds(550));
        recipe1.setCategories(Set.of(category2));
        recipe1.setRecipeIngredients(Set.of(recipeIngredient, recipeIngredient1));
        recipe1.setImage(imageRepository.findByRecipe(recipe1).orElseThrow());

        recipe2.setTitle("Steak");
        recipe2.setSummary("Not for vegans");
        recipe2.setContent("With some really nice gravy");
        recipe2.setIsPublished(true);
        recipe2.setAuthor(user);
        recipe2.setRating(BigDecimal.valueOf(5.0));
        recipe2.setDatePublished(LocalDateTime.now().minusSeconds(210));
        recipe2.setCategories(Set.of(category, category3));
        recipe2.setRecipeIngredients(Set.of(recipeIngredient, recipeIngredient1));
        recipe2.setImage(imageRepository.findByRecipe(recipe2).orElseThrow());

        recipe3.setTitle("Spaghetti Bolognese");
        recipe3.setSummary("Classic Italian dish");
        recipe3.setContent("A delicious pasta dish with rich tomato sauce and Parmesan cheese.");
        recipe3.setIsPublished(true);
        recipe3.setAuthor(user);
        recipe3.setRating(BigDecimal.valueOf(4.8));
        recipe3.setDatePublished(LocalDateTime.now().minusSeconds(300));
        recipe3.setCategories(Set.of(category, category4, category5));
        recipe3.setRecipeIngredients(Set.of(recipeIngredient6, recipeIngredient7, recipeIngredient8, recipeIngredient9, recipeIngredient10));
        recipe3.setImage(imageRepository.findByRecipe(recipe3).orElseThrow());

        recipe4.setTitle("Margherita Pizza");
        recipe4.setSummary("Classic Italian pizza");
        recipe4.setContent("A simple and delicious pizza with tomato, mozzarella, and basil.");
        recipe4.setIsPublished(true);
        recipe4.setAuthor(user);
        recipe4.setRating(BigDecimal.valueOf(4.9));
        recipe4.setDatePublished(LocalDateTime.now().minusSeconds(180));
        recipe4.setCategories(Set.of(category, category4));
        recipe4.setRecipeIngredients(Set.of(recipeIngredient, recipeIngredient6, recipeIngredient7, recipeIngredient9, recipeIngredient10));
        recipe4.setImage(imageRepository.findByRecipe(recipe4).orElseThrow());


        recipeRepository.saveAll(Set.of(recipe, recipe1, recipe2, recipe3, recipe4));
    }
}