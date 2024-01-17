package com.portfolio.fictionfood.image;

import com.portfolio.fictionfood.recipe.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;
    private final RecipeRepository recipeRepository;

//    @PostMapping
//    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
//        String uploadImage = imageService.uploadRecipeImage(file);
//        return ResponseEntity.status(HttpStatus.OK).body(uploadImage);
//    }

    @GetMapping("/{id}")
    public ResponseEntity<?> downloadImage(@PathVariable long id) {
        byte[] imageData = imageService.downloadImage(recipeRepository.findById(id).orElseThrow().getImage().getName());
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf(IMAGE_PNG_VALUE))
                .body(imageData);
    }
}
