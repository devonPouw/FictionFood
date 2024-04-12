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
      const response = await backendApi.getAllRecipes(0, 6, false, "");
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
      <div className="w-full flex items-center justify-center">
        <div className="md:w-3/4 w-full px-5 md:px-0 h-[200px] flex flex-col items-center justify-center">
          <span className="text-lg text-center">
            Ever wished you could recreate that mouthwatering dish from your
            favorite movie, or bake the cookies that enchanted a cartoon
            character?
          </span>
          <span className="font-bold text-2xl">
            Welcome to <span className="font-semibold font-serif">F</span>
            iction
            <span className="font-semibold font-serif">f</span>ood
          </span>

          <span className="text-lg text-center">
            your kitchen portal to the world of on-screen eats!
          </span>
          <span className="text-lg text-center">
            Discover delicious recipes inspired by the screen, share your own
            culinary recreations, and connect with fellow food and film
            enthusiasts.
          </span>
        </div>
      </div>
      <RecipePreview recipeList={recipeList} />
      <Footer />
    </div>
  );
}
