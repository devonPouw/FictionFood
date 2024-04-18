package com.portfolio.fictionfood.category;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.portfolio.fictionfood.recipe.Recipe;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Jacksonized
@Entity(name = "CATEGORIES")
@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String name;

    @ManyToMany(mappedBy = "categories")
    @JsonBackReference
    private List<Recipe> recipes;

    public Category(String name) {
        this.name = name;
    }
}