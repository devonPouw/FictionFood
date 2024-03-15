package com.portfolio.fictionfood.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private String nickname;
    private UserRole role;
    private String email;
    private Long avatarId;
}
