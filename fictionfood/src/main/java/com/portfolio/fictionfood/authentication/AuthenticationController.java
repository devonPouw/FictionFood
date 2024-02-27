package com.portfolio.fictionfood.authentication;

import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.recipe.RecipeController;
import com.portfolio.fictionfood.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    private final AuthenticationService service;
    private final UserRepository repository;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestPart("register") String registerJson,
            @RequestPart("avatar") MultipartFile avatar
    ) {
//        if (repository.existsByUsername(request.getUsername())) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        } else if (repository.existsByEmail(request.getEmail())) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        } else if (repository.existsByNickname(request.getNickname())) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
        try{
            AuthenticationResponse registerRequest = service.register(registerJson, avatar);
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
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }
}
