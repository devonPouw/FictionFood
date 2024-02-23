package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.recipeingredient.RecipeIngredientDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeInfoDto {
    private Long id;
    private String title;
    private BigDecimal rating;
    private String summary;
    private String content;
    private Set<RecipeIngredientDto> recipeIngredients;
    private Set<String> categories;
    private Boolean isPublished;
    private Long imageId;
    private String author;
    private Long authorImageId;
}