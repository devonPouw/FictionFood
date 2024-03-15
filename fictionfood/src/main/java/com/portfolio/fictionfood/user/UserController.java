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
import java.security.Principal;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);
    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal User currentUser){
        try {
            UserDto userDto = userService.getProfile(currentUser);
            return ResponseEntity.ok().body(userDto);
        }catch (UnauthorizedException u) {
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
        }catch (IllegalStateException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PatchMapping("/profile/avatar")
    public ResponseEntity<?> changeAvatar(@RequestPart("image") MultipartFile image, @AuthenticationPrincipal User currentUser){
        try{
            userService.changeAvatar(image, currentUser);
            return ResponseEntity.status(HttpStatus.OK).body("Avatar successfully changed!");
        }
        catch(IOException e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        catch(UnauthorizedException u){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        catch(Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
