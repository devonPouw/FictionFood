package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.user.User;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;

public interface RecipeRepository extends JpaRepository<Recipe, Long>, JpaSpecificationExecutor<Recipe> {

    @NonNull
    Page<Recipe> findAll(@NonNull Specification<Recipe> specification, @NonNull Pageable pageable);
    Page<Recipe> findAllByIsPublished(@NonNull Specification<Recipe> specification, @NonNull Boolean isPublished, @NonNull Pageable pageable);
    Page<Recipe> findByIsPublished(@NonNull Boolean isPublished, Pageable pageable);

    Page<Recipe> findByAuthor(@NonNull User author, Pageable pageable);

    Long countByAuthorAndDatePublishedAfter(@NonNull User author, @NonNull LocalDateTime oneMonthAgo);
}
