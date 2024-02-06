import { backendApi } from "@/services/ApiMappings";
import { IRecipeList } from "@/types/Recipe";
import { useEffect, useState } from "react";
import NavBar from "../header/NavBar";
import RecipePreview from "./RecipePreview";
import Footer from "../footer/Footer";

export default function RecipeList() {
  const initialRecipeListState = {
    recipes: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  };

  const [recipeList, setRecipeList] = useState<IRecipeList>(
    initialRecipeListState
  );
  const amountOfRecipes = 9;

  const handlePageChange = async (event, value) => {
    const page = value != null ? value.activePage - 1 : 0;
    try {
      const response = await backendApi.getAllRecipes(page, amountOfRecipes);
      setRecipeList(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handlePageChange();
  }, []);

  return (
    <div>
      <NavBar />
      <RecipePreview recipeList={recipeList} />
      <Footer />
    </div>
  );
}
