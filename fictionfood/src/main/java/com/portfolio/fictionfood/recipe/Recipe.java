package com.portfolio.fictionfood.recipe;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.portfolio.fictionfood.category.Category;
import com.portfolio.fictionfood.image.RecipeImage;
import com.portfolio.fictionfood.recipeingredient.RecipeIngredient;
import com.portfolio.fictionfood.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Jacksonized
@Entity(name = "RECIPES")
@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    private String title;

    private String summary;

    @NonNull
    @Column(columnDefinition = "CLOB")
    private String content;

    private BigDecimal rating;

    //    private Set<User> amountOfReviews;
    @OneToOne
    @JsonManagedReference
    private RecipeImage image;
    //    @NonNull
    @ManyToOne
    @JoinColumn(nullable = true) //set to false later
    @JsonManagedReference
    private User author;

    private Boolean isPublished;

    @ManyToMany
    @JsonManagedReference
    @JoinTable(
            name = "recipe_categories"
    )
    private Set<Category> categories;

    @NonNull
    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime datePublished;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<RecipeIngredient> recipeIngredients;
}
