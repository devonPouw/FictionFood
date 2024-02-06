import { IRecipeList } from "@/types/Recipe";
import { useState, useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface RecipePreviewProps {
  recipeList: IRecipeList;
}

const RecipePreview: React.FC<RecipePreviewProps> = ({ recipeList }) => {
  const { recipes } = recipeList;
  const [imageSrcList, setImageSrcList] = useState<Record<string, string>>();
  const navigate: NavigateFunction = useNavigate();
  useEffect(() => {
    const fetchImages = async () => {
      if (recipes) {
        const newImageSrcList: Record<string, string> = {};

        for (const recipe of recipes) {
          if (recipe.imageData) {
            newImageSrcList[
              recipe.title
            ] = `data:image/jpeg;base64,${recipe.imageData}`;
          }
        }
        setImageSrcList(newImageSrcList);
      }
    };

    fetchImages();
  }, [recipes]);

  const goToRecipe = (id: number | null) => {
    if (id !== null) {
      navigate(`/recipes/${id}`);
    } else {
      console.error("Attempted to navigate to a recipe with a null id");
    }
  };

  return !imageSrcList ? (
    <div>loading...</div>
  ) : (
    <div className="w-screen h-auto flex justify-center dark:text-white">
      <div className="w-3/4 grid py-4 gap-6 grid-cols-3 justify-items-center">
        {recipes.map((recipe) => (
          <div
            className="h-auto w-full px-4 py-4 rounded-xl border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30"
            key={recipe.id}
            onClick={() => goToRecipe(recipe.id)}
          >
            <div>
              <span className="flex text-xl font-semibold justify-center rounded-lg p-1 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30">
                {recipe.title}
              </span>
            </div>
            <div className="flex justify-end">
              {recipe.categories.map((category) => (
                <div
                  className="border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30 rounded-lg p-1 m-2 text-sm"
                  key={category}
                >
                  {category}
                </div>
              ))}
            </div>
            <div className="rounded-lg p-1 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30">
              Rating: {recipe.rating} ★
            </div>
            <div className="p-2">
              <img
                className="w-full max-h-[300px] min-h-[300px] object-cover rounded-lg"
                src={imageSrcList[recipe.title]}
                alt={recipe.title}
              />
            </div>
            <div className="rounded-t-lg p-1 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30">
              {recipe.summary}
            </div>

            <div className="p-1 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30">
              Posted: {recipe.datePublished}
            </div>

            <div className="rounded-b-lg p-1 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30">
              Written by {recipe.author}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipePreview;
