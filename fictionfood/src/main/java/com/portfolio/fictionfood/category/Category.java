package com.portfolio.fictionfood.category;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.recipe.RecipeViews;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Jacksonized
@Entity
@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "CATEGORIES")
public class Category {

    @JsonView({RecipeViews.GetRecipeList.class})
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @JsonView({RecipeViews.GetRecipeList.class})
    private String name;

    @ManyToMany(mappedBy = "categories")
    @JsonBackReference
    private List<Recipe> recipes;
}