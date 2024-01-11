package com.portfolio.fictionfood.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import com.portfolio.fictionfood.authentication.token.Token;
import com.portfolio.fictionfood.image.Image;
import com.portfolio.fictionfood.recipe.Recipe;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

@Jacksonized
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "USERS", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"nickname", "username"})
})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @JsonView({UserViews.viewMe.class})
    @Column(unique = true)
    private String username;

    @NonNull
    @JsonView({UserViews.viewMe.class})
    @Column(unique = true)
    private String email;

    @NonNull
    @JsonView({UserViews.viewMe.class})
    @Column(unique = true)
    private String nickname;

    @NonNull
    private String password;

    @NonNull
    @JsonView(UserViews.viewMe.class)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToMany(mappedBy = "user")
    private Set<Token> tokens;

    @OneToMany(mappedBy = "author")
    @JsonManagedReference
    private Set<Recipe> recipes;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonBackReference
    private Image avatar;

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
