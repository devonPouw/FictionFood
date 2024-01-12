package com.portfolio.fictionfood.recipe;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.portfolio.fictionfood.category.Category;
import com.portfolio.fictionfood.image.Image;
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

    @JsonView({RecipeViews.GetRecipeList.class})
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @JsonView({RecipeViews.GetRecipeList.class})
    private String title;

    @JsonView({RecipeViews.GetRecipeList.class})
    @Column(columnDefinition = "CLOB")
    private String summary;

    @NonNull
    @Column(columnDefinition = "CLOB")
    private String content;

    @JsonView({RecipeViews.GetRecipeList.class})
    private BigDecimal rating;

    //    private Set<User> amountOfReviews;
    @JsonView({RecipeViews.GetRecipeList.class})
    @OneToOne
    @JsonManagedReference
    private Image image;
    //    @NonNull
    @JsonView({RecipeViews.GetRecipeList.class})
    @ManyToOne
    @JoinColumn(nullable = true) //set to false later
    @JsonManagedReference
    private User author;

    private Boolean isPublished;

    @JsonView({RecipeViews.GetRecipeList.class})
    @ManyToMany
    @JsonManagedReference
    @JoinTable(
            name = "recipe_categories"
    )
    private Set<Category> categories;

    @NonNull
    @JsonView({RecipeViews.GetRecipeList.class})
    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime datePublished;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<RecipeIngredient> recipeIngredients;
}
