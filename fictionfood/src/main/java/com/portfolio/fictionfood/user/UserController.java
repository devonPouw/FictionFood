package com.portfolio.fictionfood.user;

import com.portfolio.fictionfood.exception.UnauthorizedException;
import com.portfolio.fictionfood.recipe.RecipeController;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);
    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal User currentUser) {
        try {
            UserDto userDto = userService.getProfile(currentUser);
            return ResponseEntity.ok().body(userDto);
        } catch (UnauthorizedException u) {
            logger.error("User {} was unauthorized fetching profile", currentUser.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (RuntimeException b) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Error e) {
            logger.error("Error fetching profile for user: {}", currentUser.getUsername());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/profile/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        try {
            userService.changePassword(request, currentUser);
            return ResponseEntity.status(HttpStatus.OK).body("Password successfully changed!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PatchMapping("/profile/avatar")
    public ResponseEntity<?> changeAvatar(@RequestPart("image") MultipartFile image, @AuthenticationPrincipal User currentUser) {
        try {
            userService.changeAvatar(image, currentUser);
            return ResponseEntity.status(HttpStatus.OK).body("Avatar successfully changed!");
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @PatchMapping("/profile/email")
    public ResponseEntity<?> changeEmail(@RequestBody ChangeEmailRequest request, @AuthenticationPrincipal User currentUser) {
        try {
            if (currentUser.getEmail().equals(request.getNewEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New email is the same as the current one");
            }
            userService.changeEmail(request, currentUser);
            return ResponseEntity.status(HttpStatus.OK).body("Email successfully changed!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PatchMapping("/profile/nickname")
    public ResponseEntity<?> changeNickname(@RequestBody ChangeNicknameRequest request, @AuthenticationPrincipal User currentUser) {
        try {
            if (userRepository.existsByNickname(request.getNewNickname())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nickname already in use");
            }
            else if(currentUser.getNickname().equals(request.getNewNickname())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New nickname is the same as the current one");
            }
            userService.changeNickname(request, currentUser);
            return ResponseEntity.status(HttpStatus.OK).body("Nickname successfully changed!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
