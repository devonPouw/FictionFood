package com.portfolio.fictionfood.image;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.recipe.RecipeViews;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeImage extends Image{

    @JsonView({RecipeViews.GetRecipeList.class})
    @OneToOne
    @JsonBackReference
    private Recipe recipe;
    @Override
    void setLink(Object object) {
        recipe = (Recipe) object;
    }
}
