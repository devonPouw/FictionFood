package com.portfolio.fictionfood.authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.fictionfood.authentication.token.Token;
import com.portfolio.fictionfood.authentication.token.TokenRepository;
import com.portfolio.fictionfood.authentication.token.TokenType;
import com.portfolio.fictionfood.config.JwtService;
import com.portfolio.fictionfood.image.ImageRepository;
import com.portfolio.fictionfood.image.ImageService;
import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    private final JwtService jwtService;
    private final ImageService imageService;
    private final AuthenticationManager authenticationManager;
    private final ImageRepository imageRepository;

    public AuthenticationResponse register(String registerJson, MultipartFile avatar) throws IOException {
        RegisterRequest request = objectMapper.readValue(registerJson, RegisterRequest.class);
        var user = new User();
        user.setNickname(request.getNickname());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        repository.save(user);
        imageService.uploadImage(avatar, user);
        user.setAvatar(imageRepository.findByUser(user).orElseThrow());

        var savedUser = repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveRefreshToken(savedUser, refreshToken);
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(86400000);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshTokenCookie)
                .build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = repository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);

        Token refreshTokenObj = tokenRepository.findByUser(user).orElse(null);

        String refreshToken;
        if (refreshTokenObj == null) {  // Handle the 'no token found' case
            refreshToken = jwtService.generateRefreshToken(user);
            saveRefreshToken(user, refreshToken);
        } else {
            refreshToken = refreshTokenObj.getToken();
            if (!jwtService.isTokenValid(refreshToken, user)) {
                tokenRepository.delete(refreshTokenObj);
                refreshToken = jwtService.generateRefreshToken(user);
                saveRefreshToken(user, refreshToken);
            }
        }
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(86400000);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshTokenCookie)
                .build();
    }

    private void saveRefreshToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .build();
        tokenRepository.save(token);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        String refreshToken = authHeader.substring(7);
        String username = jwtService.extractUsername(refreshToken);
        if (username == null) {
            return;
        }

        var user = this.repository.findByUsername(username).orElseThrow();
        var accessToken = jwtService.generateToken(user);

        if (!jwtService.isTokenValid(refreshToken, user)) {
            tokenRepository.delete(tokenRepository.findByToken(refreshToken).orElseThrow());
            refreshToken = jwtService.generateRefreshToken(user);
            saveRefreshToken(user, refreshToken);
        }

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(86400000);
        response.addCookie(refreshTokenCookie);

        var authResponse = AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenCookie)
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
    }

}