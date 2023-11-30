package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.user.User;
import io.micrometer.common.lang.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Long countByAuthorAndDatePublishedAfter(@NonNull User author, @NonNull LocalDateTime oneMonthAgo);
}
