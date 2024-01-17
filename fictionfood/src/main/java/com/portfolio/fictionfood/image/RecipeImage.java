package com.portfolio.fictionfood.image;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.portfolio.fictionfood.recipe.Recipe;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeImage extends Image {

    @OneToOne
    @JsonBackReference
    private Recipe recipe;

    @Override
    void setLink(Object object) {
        recipe = (Recipe) object;
    }
}
