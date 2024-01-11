package com.portfolio.fictionfood.category;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "CATEGORIES")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String name;

    @ManyToMany(mappedBy = "categories")
    @JsonManagedReference
    private List<Recipe> recipes;
}