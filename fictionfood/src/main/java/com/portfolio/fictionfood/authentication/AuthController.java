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
@RequestMapping("/auth")
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

        User user = new User();
        user.setNickname(registerRequest.nickname);
        user.setUsername(registerRequest.username);
        user.setEmail(registerRequest.email);
        if (registerRequest.password.equals(registerRequest.matchingPassword))
            user.setPassword(passwordEncoder.encode(registerRequest.password));
        else
            return new ResponseEntity<>("Passwords do not match!", HttpStatus.BAD_REQUEST);
        user.setRole(UserRole.CHEF);

        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    public record LoginRequest(String username, String password) {
    }

    public record RegisterRequest(String nickname, String username, String email, String password,
                                  String matchingPassword) {
    }

    public record AuthResponse(String accessToken) {
    }
}
