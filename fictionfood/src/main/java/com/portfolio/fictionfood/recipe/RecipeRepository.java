package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.user.User;
import io.micrometer.common.lang.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Page<Recipe> findByIsPublished(@NonNull Boolean isPublished, Pageable pageable);

    Optional<Recipe> findByIdAndIsPublished(@NonNull Long id, @NonNull Boolean isPublished);

    Long countByAuthorAndDatePublishedAfter(@NonNull User author, @NonNull LocalDateTime oneMonthAgo);
}
