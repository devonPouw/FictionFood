package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.user.User;
import io.micrometer.common.lang.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Page<Recipe> findByIsPublished(@NonNull Boolean isPublished, Pageable pageable);
    Page<Recipe> findByAuthor(@NonNull User author, Pageable pageable);

    Long countByAuthorAndDatePublishedAfter(@NonNull User author, @NonNull LocalDateTime oneMonthAgo);
}
