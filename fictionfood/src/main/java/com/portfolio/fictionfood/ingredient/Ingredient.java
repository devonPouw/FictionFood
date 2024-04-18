package com.portfolio.fictionfood.ingredient;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredient;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

import java.util.List;


@Jacksonized
@Entity(name = "INGREDIENTS")
@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private String name;
    @OneToMany(mappedBy = "ingredient", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<RecipeIngredient> recipeIngredients;

    public Ingredient(String name) {
        this.name = name;
    }
}
