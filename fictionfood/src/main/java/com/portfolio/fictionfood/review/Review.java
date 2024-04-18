package com.portfolio.fictionfood.review;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

        private Long recipeId;

        private Long userId;
}
