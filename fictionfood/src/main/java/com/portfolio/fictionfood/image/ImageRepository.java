package com.portfolio.fictionfood.image;

import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<Image> findByName(String name);

    Optional<RecipeImage> findByRecipe(Recipe recipe);

    Optional<UserImage> findByUser(User user);
}