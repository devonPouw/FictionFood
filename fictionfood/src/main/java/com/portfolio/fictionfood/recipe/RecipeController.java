package com.portfolio.fictionfood.recipe;

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
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recipes")
public class RecipeController {

    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);
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
                                        Principal principal) {
        String name = principal.getName();
        logger.info("Attempting to post a new recipe by user: {}", name);

        if (!checkIfAllowedToPost(SecurityContextHolder.getContext().getAuthentication())) {
            logger.warn("User: {} is not allowed to post more recipes", name);
            return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
        }

        try {
            Recipe recipe = recipeService.postRecipe(recipeJson, image, principal);
            logger.info("Recipe successfully posted with ID: {}", recipe.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(recipe);
        } catch (IOException e) {
            logger.error("Error posting recipe", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteRecipeById(@PathVariable("id") long id) {
        recipeRepository.deleteById(id);
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
