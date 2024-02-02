package com.portfolio.fictionfood.authentication;

import com.portfolio.fictionfood.user.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank
    @Size(min = 3, max = 15)
    private String nickname;
    private String username;
    private String email;
    private String password;
    private UserRole role;
}
