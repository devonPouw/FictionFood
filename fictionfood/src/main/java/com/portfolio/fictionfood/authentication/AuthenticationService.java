package com.portfolio.fictionfood.authentication;

import com.portfolio.fictionfood.authentication.token.RefreshTokenDto;
import com.portfolio.fictionfood.authentication.token.Token;
import com.portfolio.fictionfood.authentication.token.TokenRepository;
import com.portfolio.fictionfood.authentication.token.TokenType;
import com.portfolio.fictionfood.config.JwtService;
import com.portfolio.fictionfood.image.ImageRepository;
import com.portfolio.fictionfood.image.ImageService;
import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRepository;
import lombok.RequiredArgsConstructor;
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
    private final JwtService jwtService;
    private final ImageService imageService;
    private final AuthenticationManager authenticationManager;
    private final ImageRepository imageRepository;

    public AuthenticationResponse register(RegisterRequest request, MultipartFile avatar) throws IOException {

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
        saveUserToken(savedUser, refreshToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
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
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(user, refreshToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .build();
        tokenRepository.save(token);
    }

    public AuthenticationResponse refreshToken(RefreshTokenDto refreshTokenDto) {
        final String refreshToken = refreshTokenDto.getRefreshToken();
        final String username = jwtService.extractUsername(refreshToken);
        if (username != null) {
            var user = this.repository.findByUsername(username)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                return new AuthenticationResponse(accessToken, refreshToken);
            } else {
                var accessToken = jwtService.generateToken(user);
                var newRefreshToken = jwtService.generateRefreshToken(user);
                saveUserToken(user, newRefreshToken);
                return new AuthenticationResponse(accessToken, newRefreshToken);
            }

        }
        return null;
    }
}