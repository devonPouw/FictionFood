import RecipeDataService from "@/services/recipe/RecipeService";
import { IRecipeData } from "@/types/Recipe";
import { ChangeEvent, useState } from "react";
import NavBar from "../header/NavBar";

const AddRecipe: React.FC = () => {
    const initialRecipeState = {
        id: null,
        title: "",
        summary: "",
        content: "",
        recipeIngredients: [],
        categories: [],
        isPublished: false,
        author: {},
        rating: 0.0,
        datePublished: ""
    };
    const [recipe, setRecipe] = useState<IRecipeData>(initialRecipeState)
    const [submitted, setSubmitted] = useState<boolean>(false)

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setRecipe({...recipe, [name]: value});
    };
    const saveRecipe = () => {
        const data = {
        title: recipe.title,
        summary: recipe.summary,
        content: recipe.content,
        recipeIngredients: recipe.recipeIngredients,
        categories: recipe.categories,
        published: recipe.isPublished,
        author: recipe.author,
        rating: recipe.rating,
        datePublished: recipe.datePublished
    };
    RecipeDataService.create(data)
    .then((response) => {
        setRecipe({
            title: response.data.title,
            summary: response.data.summary,
            content: response.data.content,
            recipeIngredients: response.data.recipeIngredients,
            categories: response.data.categories,
            isPublished: response.data.isPublished,
            author: response.data.author,
            rating: initialRecipeState.rating,
            datePublished: response.data.datePublished
        });
        setSubmitted(true)
        console.log(response.data)
    })
    .catch((e: Error) => {
        console.log(e)
    })
}
const newRecipe = () => {
    setRecipe(initialRecipeState);
    setSubmitted(false);
}
return (
  <>
  <NavBar />
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newRecipe}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              required
              value={recipe.title}
              onChange={handleInputChange}
              name="title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Description</label>
            <input
              type="text"
              className="form-control"
              id="content"
              required
              value={recipe.content}
              onChange={handleInputChange}
              name="content"
            />
          </div>

          <button onClick={saveRecipe} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default AddRecipe;