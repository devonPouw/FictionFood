package com.portfolio.fictionfood.review;

import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Entity(name = "REVIEWS")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private String title;
    private String content;
    private Double rating;
    @ManyToOne
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
