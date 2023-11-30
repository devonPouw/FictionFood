package com.portfolio.fictionfood;

import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRepository;
import com.portfolio.fictionfood.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Component
public class Seeder implements CommandLineRunner {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;


    @Override
    public void run(String... args) throws IOException {
        System.out.println("Seeding database...");
        seedUsers();

    }

    private void seedUsers() {
        userRepository.saveAllAndFlush(List.of(
                User.builder()
                        .role(UserRole.MODERATOR)
                        .nickname("GordonRamsay")
                        .username("mod")
                        .email("ramsay@example.com")
                        .password("123")
                        .build()
        ));
    }
}