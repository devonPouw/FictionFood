package com.portfolio.fictionfood.image;

import com.portfolio.fictionfood.recipe.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<Image> findByName(String name);
    Optional<RecipeImage> findByRecipe(Recipe recipe);
}
