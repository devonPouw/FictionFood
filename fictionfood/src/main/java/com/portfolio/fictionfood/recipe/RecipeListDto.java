package com.portfolio.fictionfood.recipe;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeListDto {
    private Long id;
    private String title;
    private String summary;
    private String author;
    private Set<String> categories;
    private Long imageId;
    private LocalDateTime datePublished;
    private BigDecimal rating;
}
