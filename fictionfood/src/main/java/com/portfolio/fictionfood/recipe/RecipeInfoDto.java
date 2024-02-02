package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.recipeingredient.RecipeIngredientDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeInfoDto {
    private String title;
    private String summary;
    private String content;
    private Set<RecipeIngredientDto> recipeIngredients;
    private Set<String> categories;
    private Boolean isPublished;
    private byte[] recipeImage;
    private String author;
//    private byte[] authorImage;
}