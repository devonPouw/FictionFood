package com.portfolio.fictionfood.user;

import com.portfolio.fictionfood.image.ImageRepository;
import com.portfolio.fictionfood.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ImageService imageService;
    private final ImageRepository imageRepository;

    public UserDto getProfile(User currentUser) {
        return UserDto.builder()
                .email(currentUser.getEmail())
                .nickname(currentUser.getNickname())
                .avatarId(currentUser.getAvatar().getId())
                .role(currentUser.getRole())
                .build();
    }

    public void changePassword(ChangePasswordRequest request, User currentUser) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }

    public void changeAvatar(MultipartFile avatar, User currentUser) throws IOException {
        imageService.uploadImage(avatar, currentUser);
        currentUser.setAvatar(imageRepository.findByUser(currentUser).orElseThrow());
        userRepository.save(currentUser);
    }
}