package com.portfolio.fictionfood.authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.fictionfood.authentication.token.RefreshTokenDto;
import com.portfolio.fictionfood.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else if (repository.existsByEmail(request.getEmail())) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else if (repository.existsByNickname(request.getNickname())) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            AuthenticationResponse registerRequest = service.register(request, avatar);
            logger.info("User successfully registered with username: {}", registerJson.split(":")[1].split(",")[0]);
            return ResponseEntity.status(HttpStatus.CREATED).body(registerRequest);
        } catch (IOException e) {
            logger.error("Error registering user", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody LoginRequest request
    ) {
        return new ResponseEntity<>(service.login(request), HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenDto refreshTokenDTO)  {
        logger.info("Issuing new refresh token");
       return new ResponseEntity<>(service.refreshToken(refreshTokenDTO), HttpStatus.OK) ;
    }
}
