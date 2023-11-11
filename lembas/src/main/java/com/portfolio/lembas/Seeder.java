package com.portfolio.lembas;

import com.portfolio.lembas.user.User;
import com.portfolio.lembas.user.UserRepository;
import com.portfolio.lembas.user.UserRole;
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
                        .password("123")
                        .build()

        ));
    }
}