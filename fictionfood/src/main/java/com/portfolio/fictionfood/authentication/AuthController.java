package com.portfolio.fictionfood.authentication;

import com.portfolio.fictionfood.authentication.token.TokenProvider;
import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRepository;
import com.portfolio.fictionfood.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)
        );
        String token = tokenProvider.generate(auth);
        return new AuthResponse(token);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {

        if (userRepository.existsByUsername(registerRequest.username)) {
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(registerRequest.email)) {
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }
        try {
            var user = User.builder()
                    .nickname(registerRequest.nickname)
                    .username(registerRequest.username)
                    .email(registerRequest.email)
                    .password(passwordEncoder.encode(registerRequest.password))
                    .role(UserRole.CHEF)
                    .build();

            userRepository.save(user);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    public record LoginRequest(String username, String password) {
    }

    public record RegisterRequest(String nickname, String username, String email, String password) {
    }

    public record AuthResponse(String accessToken) {
    }
}
