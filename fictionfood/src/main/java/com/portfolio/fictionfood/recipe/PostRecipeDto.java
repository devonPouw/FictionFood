package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.recipeingredient.RecipeIngredientDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostRecipeDto {
    private String title;
    private String summary;
    private String content;
    private List<RecipeIngredientDto> recipeIngredients;
    private String[] categories;
    private Boolean isPublished;
    private MultipartFile image;
}