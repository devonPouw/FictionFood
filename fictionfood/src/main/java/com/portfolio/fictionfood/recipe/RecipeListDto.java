package com.portfolio.fictionfood.recipe;

import jakarta.persistence.UniqueConstraint;
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
    private byte[] imageData;
    private LocalDateTime datePublished;
    private BigDecimal rating;
}
