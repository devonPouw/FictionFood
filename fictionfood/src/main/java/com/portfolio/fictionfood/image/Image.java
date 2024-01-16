package com.portfolio.fictionfood.image;

import com.fasterxml.jackson.annotation.JsonView;
import com.portfolio.fictionfood.recipe.RecipeViews;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.AbstractPersistable;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Getter
@Setter
public abstract class Image extends AbstractPersistable<Long> {

//    @Id
//    @GeneratedValue(strategy = GenerationType.SEQUENCE)
//    private Long id;

    @JsonView({RecipeViews.GetRecipeList.class})
    private String name;

    @JsonView({RecipeViews.GetRecipeList.class})
    private String type;

    @JsonView({RecipeViews.GetRecipeList.class})
    @Lob
    private byte[] imageData;

    abstract void setLink(Object object);
}