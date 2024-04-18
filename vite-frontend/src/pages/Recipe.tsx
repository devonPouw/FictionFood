import Footer from "@/components/footer/Footer";
import NavBar from "@/components/header/NavBar";
import { backendApi } from "@/services/ApiMappings";
import { IRecipeData } from "@/types/Recipe";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

export default function Recipe() {
  const [recipe, setRecipe] = useState<IRecipeData | null>(null);
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const fetchRecipe = async () => {
    try {
      const response = await backendApi.getRecipeById(Number(id));
      setRecipe(response.data);
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
    if (id) fetchRecipe();
  }, [id]);

  return (
    <div className="w-full h-full">
      <NavBar />
      <div className="w-full flex items-center justify-center">
        {recipe ? (
          <div className="w-4/6 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30">
            <div className="text-2xl flex p-3 justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-300 backdrop-blur-2xl dark:border-neutral-900 dark:bg-zinc-900/40 dark:from-inherit lg:border lg:bg-gray-200 lg:dark:bg-zinc-900/40">
              {recipe.title}
            </div>
            <div className="p-3">Rating: {recipe.rating} ★</div>
            <div className="flex justify-end">
              {recipe.categories.map((category) => (
                <div
                  className="border border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30 rounded-lg p-1 m-2 text-sm"
                  key={category}
                >
                  {category}
                </div>
              ))}
            </div>
            <div className="p-2 flex justify-center">
              <img
                className="w-1/2 h-full object-contain rounded-lg overflow-hidden"
                src={
                  import.meta.env.VITE_HTTPS_BACKEND +
                  `/images/${recipe.imageId}`
                }
                alt={recipe?.title || "Recipe Image"}
              ></img>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-3/4">
                <div className="p-3 text-lg">{recipe.summary}</div>
                <label className="text-sm">
                  Ingredients:
                  <ul className="px-3 text-base">
                    {recipe.recipeIngredients.map((recipeIngredient, index) => (
                      <li key={index}>
                        {recipeIngredient.quantity}{" "}
                        {recipeIngredient.ingredient} {recipeIngredient.unit}
                      </li>
                    ))}
                  </ul>
                </label>
                <div className="p-3 text-lg">{recipe.content}</div>
                <div className="flex items-center justify-end p-1">
                  <div className="mr-2">{recipe.author}</div>
                  <Avatar>
                    <AvatarImage
                      src={
                        import.meta.env.VITE_HTTPS_BACKEND +
                        `/images/${recipe.authorImageId}`
                      }
                      alt="avatar"
                    />
                    <AvatarFallback>
                      {recipe.author.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>{recipe.datePublished}</div>
              </div>
            </div>
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
      </div>
      <Footer />
    </div>
  );
}
