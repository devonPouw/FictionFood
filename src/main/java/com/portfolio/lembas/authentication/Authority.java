package com.portfolio.lembas.authentication;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Authority {
    READ("read"),
    WRITE("write"),
    UPDATE("update"),
    DELETE("delete");

    private final String value;
}