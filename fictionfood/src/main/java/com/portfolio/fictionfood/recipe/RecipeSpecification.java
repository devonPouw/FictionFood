package com.portfolio.fictionfood.recipe;

import com.portfolio.fictionfood.user.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class RecipeSpecification {

    public static Specification<Recipe> filterRecipe(User currentUser, Boolean viewOwnRecipes) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);

            if (currentUser == null) {
                return criteriaBuilder.conjunction();
            } else if (viewOwnRecipes) {
                return criteriaBuilder.equal(root.get("author"), currentUser);
            } else {
                return criteriaBuilder.or(
                        criteriaBuilder.equal(root.get("author"), currentUser),
                        criteriaBuilder.notEqual(root.get("author"), currentUser)
                );
            }
        };
    }

    public static Specification<Recipe> searchRecipe(String search) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            Predicate titlePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likePattern(search));
            Predicate authorPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("author").get("nickname")), likePattern(search));
            Predicate categoryPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("categories").get("name")), likePattern(search));
            Predicate ingredientPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("recipeIngredients").get("ingredient").get("name")), likePattern(search));
            return criteriaBuilder.or(titlePredicate, authorPredicate, categoryPredicate, ingredientPredicate);
        };
    }

    private static String likePattern(String value) {
        return "%" + value.toLowerCase() + "%";
    }
}
