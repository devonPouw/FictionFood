package com.portfolio.fictionfood.image;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.portfolio.fictionfood.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserImage extends Image {

    @OneToOne
    @JsonBackReference
    private User user;
    @Override
    void setLink(Object object) {
        user = (User) object;
    }
}
