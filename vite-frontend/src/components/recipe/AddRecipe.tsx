import RecipeDataService from "@/services/RecipeService";
import IRecipeData from "@/types/Recipe";
import { ChangeEvent, useState } from "react";

const AddRecipe: React.FC = () => {
    const initialRecipeState = {
        id: null,
        title: "",
        content: "",
        published: false,
        rating: 0.0,
        author: ""
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
        content: recipe.content,
        rating: recipe.rating,
        author: recipe.author,
        published: recipe.published
    };
    RecipeDataService.create(data)
    .then((response: any) => {
        setRecipe({
            title: response.data.title,
            content: response.data.content,
            published: response.data.published,
            rating: initialRecipeState.rating,
            author: response.data.author
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
  );
};

export default AddRecipe;