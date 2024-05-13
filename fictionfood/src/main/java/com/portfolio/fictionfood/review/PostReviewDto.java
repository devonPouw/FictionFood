package com.portfolio.fictionfood.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostReviewDto {
    private String title;
    private String content;
    private Double rating;
    private Long recipeId;
}