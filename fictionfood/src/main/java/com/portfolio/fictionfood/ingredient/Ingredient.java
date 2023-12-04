package com.portfolio.fictionfood.ingredient;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.extern.jackson.Jacksonized;


@Jacksonized
@Entity
@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "INGREDIENTS")
public class Ingredient {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

}
