package com.portfolio.fictionfood.review;

import com.portfolio.fictionfood.recipe.Recipe;
import com.portfolio.fictionfood.recipe.RecipeRepository;
import com.portfolio.fictionfood.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final RecipeRepository recipeRepository;

    public static double calculateAverageRating(Recipe recipe) {
        if (recipe == null || recipe.getReviews() == null) {
            return 0.0;
        }

        return recipe.getReviews().stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
    }

    public void postReview(PostReviewDto reviewDto, Long id, User currentUser) {
        Recipe recipe = recipeRepository.findById(id).orElseThrow();
        Review review = Review.builder()
                .title(reviewDto.getTitle())
                .content(reviewDto.getContent())
                .rating(reviewDto.getRating())
                .recipe(recipe)
                .user(currentUser)
                .build();
        reviewRepository.save(review);
        Double combinedRating = calculateAverageRating(recipe);
        recipe.setRating(combinedRating);
        recipeRepository.save(recipe);
    }
}
