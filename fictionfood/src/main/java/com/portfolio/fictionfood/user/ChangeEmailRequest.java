package com.portfolio.fictionfood.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangeEmailRequest {
    private String currentEmail;
    private String newEmail;
}
