package com.portfolio.lembas.user;

import java.util.Optional;

public interface UserService {
    Optional<User> getByUsername(String username);
}
