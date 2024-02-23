import Footer from "@/components/footer/Footer";
import NavBar from "@/components/header/NavBar";
import { backendApi } from "@/services/ApiMappings";
import { IRecipeData } from "@/types/Recipe";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Recipe() {
  const [recipe, setRecipe] = useState<IRecipeData | null>(null);
  const { id } = useParams<{ id: string }>();
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const fetchRecipe = async () => {
    try {
      const response = await backendApi.getRecipeById(Number(id));
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
      {recipe ? (
        <div>
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
        </div>
      ) : (
        <div className=" h-5/6 flex items-center justify-center space-x-4 m-5">
          <Skeleton className="h-1/2 w-1/3" />
          <div className="space-y-2 flex-row">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-8 w-[220px]" />
            <Skeleton className="h-8 w-[210px]" />
            <Skeleton className="h-8 w-[230px]" />
            <Skeleton className="h-8 w-[200px]" />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
