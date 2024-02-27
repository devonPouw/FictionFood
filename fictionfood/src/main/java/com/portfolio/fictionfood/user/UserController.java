package com.portfolio.fictionfood.user;

import com.portfolio.fictionfood.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    @PatchMapping("/profile/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Principal connectedUser
    ) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }
    @PatchMapping("/profile/avatar")
    public ResponseEntity<?> changeAvatar(@RequestPart("image") MultipartFile image, Principal principal){
        try{
            service.changeAvatar(image, principal);
            return new ResponseEntity<>(HttpStatus.OK);
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
