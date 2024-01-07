package com.portfolio.fictionfood.recipeingredient;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.portfolio.fictionfood.ingredient.Ingredient;
import com.portfolio.fictionfood.recipe.Recipe;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Entity
@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "RECIPE_INGREDIENTS")
public class RecipeIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private Double quantity;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Ingredient ingredient;

    @ManyToOne
    @JoinColumn(nullable = false)
    @JsonBackReference
    private Recipe recipe;

    @Enumerated(EnumType.STRING)
    private Unit unit;
}
