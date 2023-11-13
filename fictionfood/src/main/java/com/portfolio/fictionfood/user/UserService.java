package com.portfolio.fictionfood.user;

import java.util.Optional;

public interface UserService {
    Optional<User> getByUsername(String username);
}
