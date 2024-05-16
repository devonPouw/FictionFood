package com.portfolio.fictionfood.user;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangeNicknameRequest {
    private String currentNickname;
    private String newNickname;
}
