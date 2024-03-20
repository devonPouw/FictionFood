package com.portfolio.fictionfood.authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.fictionfood.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
    private final AuthenticationService service;
    private final UserRepository repository;
    private final ObjectMapper objectMapper;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestPart("register") String registerJson,
            @RequestPart("avatar") MultipartFile avatar
    ) {
        try {
            RegisterRequest request = objectMapper.readValue(registerJson, RegisterRequest.class);
            if (repository.existsByUsername(request.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already in use");
            } else if (repository.existsByNickname(request.getNickname())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nickname already in use");
            }
            AuthenticationResponse registerRequest = service.register(request, avatar);
            logger.info("User successfully registered with username: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(registerRequest);
        } catch (IOException e) {
            logger.error("Error registering user", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(service.login(request));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletResponse response, HttpServletRequest request) throws IOException {
        logger.info("Issuing new refresh token");
        service.refreshToken(request, response);
    }
}
