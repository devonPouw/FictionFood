package com.portfolio.fictionfood.image;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "IMAGES")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String name;

    private String type;

    @OneToOne
    @JsonManagedReference
    private Recipe recipe;

    @OneToOne
    @JsonManagedReference
    private User user;

    @Lob
    private byte[] imageData;
}