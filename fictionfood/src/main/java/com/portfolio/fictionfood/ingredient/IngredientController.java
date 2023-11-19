package com.portfolio.fictionfood.ingredient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/v1/ingredients")
public class IngredientController {

    @Autowired
    IngredientRepository ingredientRepository;

    @GetMapping
    public List<Ingredient> allIngredients(){
        return ingredientRepository.findAll();
    }
    @PostMapping
    public Ingredient addIngredient(@RequestBody Ingredient ingredient){
        return ingredientRepository.save(ingredient);
    }
}
