package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.category.CategoryDto;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredientDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeDto {
    private String title;
    private String summary;
    private String content;
    private RecipeIngredientDto[] recipeIngredients;
    private CategoryDto[] categories;
    private Boolean isPublished;
    private String image;
}