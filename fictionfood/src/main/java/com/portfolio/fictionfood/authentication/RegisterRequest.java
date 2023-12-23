package com.portfolio.fictionfood.authentication;

import com.portfolio.fictionfood.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String nickname;
    private String username;
    private String email;
    private String password;
    private UserRole role;
}
