package com.portfolio.fictionfood.recipeingredient;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("api/v1/units")
public class UnitController {

    @GetMapping
    public Unit[] getUnits() {
        return Unit.values();
    }
}