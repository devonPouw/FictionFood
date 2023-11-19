package com.portfolio.fictionfood.recipeingredient;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.portfolio.fictionfood.ingredient.Ingredient;
import com.portfolio.fictionfood.recipe.Recipe;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class RecipeIngredient {

    @Id
    @GeneratedValue
    private Long id;

    private double quantity;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Ingredient ingredient;

    @ManyToOne
    @JoinColumn(nullable = false)
    @JsonBackReference
    private Recipe recipe;

    @Enumerated(EnumType.STRING)
    private Unit unit;

    public RecipeIngredient(double quantity, Ingredient ingredient, Recipe recipe, Unit unit) {
        this.quantity = quantity;
        this.ingredient = ingredient;
        this.recipe = recipe;
        this.unit = unit;
    }
}
