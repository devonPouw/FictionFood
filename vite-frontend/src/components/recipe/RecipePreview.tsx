import { IRecipeList } from "@/types/Recipe";
import { NavigateFunction, useNavigate } from "react-router-dom";
interface RecipePreviewProps {
  recipeList: IRecipeList;
}

const RecipePreview: React.FC<RecipePreviewProps> = ({ recipeList }) => {
  const { recipes } = recipeList;

  const navigate: NavigateFunction = useNavigate();

  const goToRecipe = (id: number | null) => {
    if (id !== null) {
      navigate(`/recipes/${id}`);
    } else {
      console.error("Attempted to navigate to a recipe with a null id");
    }
  };

  return !recipes ? (
    <div>loading...</div>
  ) : (
    <div className="w-full h-auto flex justify-center dark:text-white">
      <div className="w-3/4 grid py-4 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
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
              {recipe.categories.map((category, index) => (
                <div
                  className="border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30 rounded-lg p-1 m-2 text-sm"
                  key={index}
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
                src={
                  import.meta.env.VITE_HTTPS_BACKEND +
                  `/images/${recipe.imageId}`
                }
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
