package com.portfolio.fictionfood.image;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.recipe.RecipeViews;
import com.portfolio.fictionfood.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "IMAGES")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @JsonView({RecipeViews.GetRecipeList.class})
    private String name;

    @JsonView({RecipeViews.GetRecipeList.class})
    private String type;

    @JsonView({RecipeViews.GetRecipeList.class})
    @OneToOne
    @JsonBackReference
    private Recipe recipe;

    @OneToOne
    @JsonBackReference
    private User user;

    @JsonView({RecipeViews.GetRecipeList.class})
    @Lob
    private byte[] imageData;
}