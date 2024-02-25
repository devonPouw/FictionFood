package com.portfolio.fictionfood.user;

import com.portfolio.fictionfood.image.UserImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private String username;
    private String nickname;
    private UserRole role;
    private String email;
    private UserImage avatar;
}
