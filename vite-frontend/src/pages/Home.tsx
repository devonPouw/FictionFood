import Footer from "@/components/footer/Footer";
import NavBar from "@/components/header/NavBar";
import RecipePreview from "@/components/recipe/RecipePreview";
import RecipeDataService from "@/services/recipe/RecipeService";
import { IRecipeList } from "@/types/Recipe";
import { useEffect, useState } from "react";

export default function Home() {
  
  const initialRecipeListState = {
    recipes: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
};
  const [recipeList, setRecipeList] = useState<IRecipeList>(initialRecipeListState)

    const fetchRecipePreview = async () => {
      try {
        const response = await RecipeDataService.getAll(0, 9);
        setRecipeList(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(() => {
    fetchRecipePreview();
  }, []);

  return (
 <div>
  <NavBar />
  <RecipePreview recipeList={recipeList} />
  <Footer />
  </div>
  )
}