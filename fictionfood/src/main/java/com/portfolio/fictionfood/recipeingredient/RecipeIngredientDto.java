package com.portfolio.fictionfood.recipeingredient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeIngredientDto {
    private String ingredient;
    private Double quantity;
    private String unit;
}