package com.portfolio.fictionfood.image;

import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.user.User;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.exception.ContextedRuntimeException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Optional;
import java.util.zip.DataFormatException;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;

    public Image setImage(Object object){
        if (object instanceof Recipe) {
            return new RecipeImage();
        }
        else if (object instanceof User){
            return new UserImage();
        }
        return null;
    }

    public void uploadImage(MultipartFile imageFile, Object object) throws IOException {
        var image = setImage(object);
        image.setName(imageFile.getOriginalFilename());
        image.setType(imageFile.getContentType());
        image.setImageData(ImageUtils.compressImage(imageFile.getBytes()));
        image.setLink(object);
        imageRepository.save(image);
    }

    public byte[] downloadImage(Long id) {
        Optional<Image> dbImage = imageRepository.findById(id);
        return dbImage.map(image -> {
            try {

                return ImageUtils.decompressImage(image.getImageData());
            } catch (DataFormatException | IOException exception) {
                throw new ContextedRuntimeException("Error downloading an image", exception)
                        .addContextValue("Image ID", id)
                        .addContextValue("Image name", image.getName());
            }
        }).orElse(null);
    }

    public MultipartFile seedImage(String path) throws IOException {
        File imageFile = new File(path);
        String name = "image";
        String originalFilename = imageFile.getName();
        String contentType = Files.probeContentType(imageFile.toPath());
        byte[] content = Files.readAllBytes(imageFile.toPath());
        return new MultipartImage(name, originalFilename, contentType, content);
    }
}
