package com.portfolio.fictionfood.category;

import com.portfolio.fictionfood.recipe.Recipe;
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
//@Table(name = "CATEGORIES")
public class Category {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    @ManyToMany
    private List<Recipe> recipes;
}
