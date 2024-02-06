import Footer from "@/components/footer/Footer";
import NavBar from "@/components/header/NavBar";
import { backendApi } from "@/services/ApiMappings";
import { useAuth } from "@/services/auth/AuthContext";
import { IRecipeData } from "@/types/Recipe";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Recipe() {
  const initialRecipeState = {
    id: null,
    title: "",
    summary: "",
    content: "",
    recipeIngredients: [],
    categories: [],
    rating: 0,
    author: "",
    datePublished: "",
  };
  const [recipe, setRecipe] = useState<IRecipeData>(initialRecipeState);
  const { getToken } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const fetchRecipe = async () => {
    const token = getToken() || "";
    try {
      const response = await backendApi.getRecipeById(Number(id), token);
      console.log(response.data);
      setRecipe(response.data);
      if (response.data.recipeImage) {
        setImageSrc(`data:image/jpeg;base64,${response.data.recipeImage}`);
      } else {
        setImageSrc(null);
      }
      console.log(imageSrc);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (id) fetchRecipe();
  }, [id]);

  return (
    <div className="w-screen h-screen">
      <NavBar />
      <div>{recipe.title}</div>
      <div>Rating: {recipe.rating} ★</div>
      <div>
        {recipe.categories.map((category, index) => (
          <div key={index}>{category}</div>
        ))}
      </div>
      <div className="p-2">
        {imageSrc && (
          <img
            className="w-full max-h-[300px] min-h-[300px] object-cover rounded-lg"
            src={imageSrc}
            alt={recipe?.title || "Recipe Image"}
          ></img>
        )}
      </div>
      <div>{recipe.summary}</div>
      <div>{recipe.content}</div>

      <div>
        {recipe.recipeIngredients.map((recipeIngredient, index) => (
          <div key={index}>
            {recipeIngredient.quantity}
            {recipeIngredient.ingredient}
            {recipeIngredient.unit}
          </div>
        ))}
      </div>

      <div>{recipe.author}</div>
      <div>{recipe.datePublished}</div>
      <Footer />
    </div>
  );
}
