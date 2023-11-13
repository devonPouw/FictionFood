package com.portfolio.fictionfood.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserServiceImplementation implements UserService {
    private final UserRepository userRepository;

    @Override
    public Optional<User> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
