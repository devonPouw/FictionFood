package com.portfolio.fictionfood.authentication;

import com.portfolio.fictionfood.user.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository repository;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        if (repository.existsByUsername(request.getUsername())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else if (repository.existsByEmail(request.getEmail())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else if (repository.existsByNickname(request.getNickname())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(service.register(request), HttpStatus.CREATED);
        }
    }

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
    AuthenticationResponse authResponse = service.login(loginRequest);

    // Create HttpOnly cookie for the JWT
    Cookie jwtCookie = new Cookie("token", authResponse.getAccessToken());
    jwtCookie.setHttpOnly(true);
    jwtCookie.setSecure(true); // Ensure you're using HTTPS
    jwtCookie.setPath("/");
    // Set a max age for the cookie, if desired
    jwtCookie.setMaxAge(24 * 60 * 60); // Example: 7 days

    // Add refresh token as a separate HttpOnly cookie, if you're using one
    Cookie refreshTokenCookie = new Cookie("refreshToken", authResponse.getRefreshToken());
    refreshTokenCookie.setHttpOnly(true);
    refreshTokenCookie.setSecure(true);
    refreshTokenCookie.setPath("/");
    refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // Example: 30 days

    // Add cookies to the response
    response.addCookie(jwtCookie);
    response.addCookie(refreshTokenCookie);

    // You might want to return a simple OK status or some user info
    return ResponseEntity.ok().body("User logged in successfully");
}
    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }
}
