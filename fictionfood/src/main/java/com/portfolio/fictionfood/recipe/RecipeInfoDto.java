package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.recipeingredient.RecipeIngredientDto;
import com.portfolio.fictionfood.review.Review;
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
    private Long id;
    private String title;
    private Double rating;
    private Set<Review> reviews;
    private String summary;
    private String content;
    private Set<RecipeIngredientDto> recipeIngredients;
    private Set<String> categories;
    private Boolean isPublished;
    private Long imageId;
    private String author;
    private Long authorImageId;
}