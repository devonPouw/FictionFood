package com.portfolio.fictionfood.review;

import com.portfolio.fictionfood.recipe.RecipeController;
import com.portfolio.fictionfood.user.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {
    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> postReview(@PathVariable("recipeId") Long id, @RequestBody PostReviewDto reviewDto, @AuthenticationPrincipal User currentUser) {
        logger.info("Request received to post review for recipe with id: {}", id);
        reviewService.postReview(reviewDto, id, currentUser);
        return ResponseEntity.ok().build();
    }
}
