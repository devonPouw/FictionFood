package com.portfolio.fictionfood.recipe;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredient;
import com.portfolio.fictionfood.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Jacksonized
@Entity
@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "RECIPES")
public class Recipe {
    @GeneratedValue
    @Id
    private Long id;

    @NonNull
    @JsonView({RecipeViews.GetRecipeList.class})
    private String title;

    @JsonView({RecipeViews.GetRecipeList.class})
    @Column(columnDefinition = "CLOB")
    private String summary;

    @NonNull
    @JsonView({RecipeViews.Serialize.class})
    @Column(columnDefinition = "CLOB")
    private String content;

    @JsonView({RecipeViews.GetRecipeList.class})
    private BigDecimal rating;

    private Long amountOfReviews;

    @NonNull
    @JsonView({RecipeViews.GetRecipeList.class})
    @ManyToOne
    @JoinColumn(nullable = false)
    @JsonManagedReference
    private User author;

    private Boolean published;

    @JsonView({RecipeViews.GetRecipeList.class})
    private Set<String> category;

    @NonNull
    @JsonView({RecipeViews.GetRecipeList.class})
    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime datePublished;


    @OneToMany(cascade = CascadeType.ALL, mappedBy = "recipe")
    @JsonManagedReference
    private Set<RecipeIngredient> recipeIngredients;

    public void addRecipeIngredient(RecipeIngredient recipeIngredient) {
        recipeIngredients.add(recipeIngredient);
    }
}
