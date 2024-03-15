import Footer from "@/components/footer/Footer";
import NavBar from "@/components/header/NavBar";
import RecipePreview from "@/components/recipe/RecipePreview";
import { useToast } from "@/components/ui/use-toast";
import { backendApi } from "@/services/ApiMappings";
import { IRecipeList } from "@/types/Recipe";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const initialRecipeListState = {
    recipes: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  };
  const [recipeList, setRecipeList] = useState<IRecipeList>(
    initialRecipeListState
  );
  const { toast } = useToast();

  const fetchRecipePreview = async () => {
    try {
      const response = await backendApi.getAllRecipes(0, 6);
      setRecipeList(response.data);
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        toast({
          description: error.response.data.message,
        });
      }
    }
  };
  useEffect(() => {
    fetchRecipePreview();
  }, []);

  return (
    <div>
      <NavBar />
      <RecipePreview recipeList={recipeList} />
      <Footer />
    </div>
  );
}
