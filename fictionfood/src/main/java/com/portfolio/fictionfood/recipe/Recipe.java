package com.portfolio.fictionfood.recipe;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredient;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Recipe {
    @GeneratedValue
    @Id
    private Long id;

    private String title;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "recipe")
    @JsonManagedReference
    private Set<RecipeIngredient> recipeIngredients = new HashSet<>();



    public void addRecipeIngredient(RecipeIngredient recipeIngredient){
        recipeIngredients.add(recipeIngredient);
    }

    public Recipe(String title) {
        this.title = title;
    }
}
