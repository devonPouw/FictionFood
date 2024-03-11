package com.portfolio.fictionfood.recipe;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.fictionfood.exception.UnauthorizedException;
import com.portfolio.fictionfood.user.User;
import com.portfolio.fictionfood.user.UserRepository;
import com.portfolio.fictionfood.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recipes")
public class RecipeController {

    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);
    private final ObjectMapper objectMapper;
    private final RecipeService recipeService;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    @Value("${app.recipe-rules.max-per-month}")
    int maxRecipesPerMonth;

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable("id") Long id, @AuthenticationPrincipal User currentUser) {
        logger.info("Request received to fetch recipe with id: {}", id);
        try {
            RecipeInfoDto recipeInfo = recipeService.getRecipeByIdAndUser(id, currentUser);
            if (recipeInfo == null) {
                logger.warn("No recipe found with id: {}", id);
                return ResponseEntity.notFound().build();
            }
            logger.debug("Returning recipe details for id: {}", id);
            return ResponseEntity.ok(recipeInfo);
        } catch (UnauthorizedException e) {
            logger.error("Error fetching recipe with id: " + id, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error fetching recipe with id: " + id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllRecipes(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        logger.info("Fetching all published recipes, page: {}, size: {}", page, size);

        try {
            Map<String, Object> response = recipeService.getAllPublishedRecipes(page, size);
            logger.debug("Fetched {} recipes for page: {}", response.get("totalItems"), page);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching recipes", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> postRecipe(@RequestPart("recipe") String recipeJson,
                                        @RequestPart("image") MultipartFile image,
                                        @AuthenticationPrincipal User currentUser) {

        logger.info("Attempting to post a new recipe by user: {}", currentUser.getUsername());

        if (!checkIfAllowedToPost(SecurityContextHolder.getContext().getAuthentication())) {
            logger.warn("User: {} is not allowed to post more recipes", currentUser.getUsername());
            return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
        }
        try {
            PostRecipeDto recipeDto = objectMapper.readValue(recipeJson, PostRecipeDto.class);
            Recipe recipe = recipeService.postRecipe(recipeDto, image, currentUser);
            logger.info("Recipe successfully posted with ID: {}", recipe.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body("Recipe successfully created!");
        } catch (IOException e) {
            logger.error("Error posting recipe", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping
    public ResponseEntity<?> updateRecipe(@RequestPart String recipeJson,
                                          @RequestPart MultipartFile image,
                                          @AuthenticationPrincipal User currentUser) {
        try {
            Recipe updatedRecipe = objectMapper.readValue(recipeJson, Recipe.class);
            if (!recipeRepository.findById(updatedRecipe.getId()).orElseThrow().getAuthor().equals(currentUser)) {
                logger.warn("User: {} tried to edit a recipe which did not belong to them", currentUser.getUsername());
                throw new UnauthorizedException("You are not authorized to edit this recipe");
            }
            Recipe recipe = recipeService.updateRecipe(updatedRecipe, image);
            logger.info("Recipe successfully edited with ID: {}", recipe.getId());
            return ResponseEntity.status(HttpStatus.OK).body("Recipe successfully updated!");
        } catch (UnauthorizedException u) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(u);
        } catch (IOException b) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(b);
        } catch (Error e) {
            logger.error("Error editing recipe", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipeById(@PathVariable("id") long id, @AuthenticationPrincipal User currentUser) {
        try {
            if (!recipeRepository.findById(id).orElseThrow().getAuthor().equals(currentUser) && !currentUser.getRole().equals(UserRole.MODERATOR)) {
                recipeRepository.deleteById(id);
                logger.info("Recipe successfully deleted with ID: {}", id);
                throw new UnauthorizedException("You are not authorized to edit this recipe");
            }
            return ResponseEntity.status(HttpStatus.OK).body("Recipe successfully deleted!");
        } catch (UnauthorizedException u) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(u);
        } catch (Error e) {
            logger.error("Error editing recipe", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    public boolean checkIfAllowedToPost(Authentication authentication) {
        if (authentication.getAuthorities().equals(UserRole.MODERATOR.getAuthorities())) {
            return true;
        }
        if (authentication.getAuthorities().equals(UserRole.CHEF.getAuthorities())) {
            long count = recipeRepository.countByAuthorAndDatePublishedAfter(userRepository.findByUsername(authentication.getName()).orElseThrow(), LocalDateTime.now().minusMonths(1));
            return count < maxRecipesPerMonth;
        }
        return false;
    }
}
