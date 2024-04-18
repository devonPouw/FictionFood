import { IRecipePreviewProps } from "@/types/Recipe";
import { useGoToRecipe } from "../../services/recipe/RecipeHelper";

const SearchRecipePreview: React.FC<IRecipePreviewProps> = ({ recipeList }) => {
  const { recipes } = recipeList;
  const goToRecipe = useGoToRecipe();

  return !recipes ? (
    <div>loading...</div>
  ) : (
    <>
      {recipes.map((recipe) => (
        <li
          aria-disabled="false"
          className="h-auto w-full flex rounded-xl border-2 border-gray-700 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:bg-gray-100 lg:dark:bg-zinc-800/30 mt-2 cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out"
          key={recipe.id}
          onClick={() => goToRecipe(recipe.id)}
        >
          <div className="p-2 flex w-1/2">
            <img
              className="w-full max-h-[180px] object-contain rounded-lg"
              src={
                import.meta.env.VITE_HTTPS_BACKEND + `/images/${recipe.imageId}`
              }
              alt={recipe.title}
            />
          </div>
          <div className="w-1/2">
            <div>
              <span className="flex text-lg font-semibold justify-around items-center rounded-lg p-1 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30">
                {recipe.title}{" "}
                <span className="text-sm font-normal">
                  {" "}
                  Rating: {recipe.rating} ★
                </span>
              </span>
            </div>
            <div className="flex justify-end flex-wrap">
              {recipe.categories.map((category, index) => (
                <div
                  className="border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30 rounded-lg p-1 m-1 text-sm whitespace-nowrap"
                  key={index}
                >
                  <span>{category}</span>
                </div>
              ))}
            </div>

            <div className="p-1 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30 text-sm">
              Posted: {recipe.datePublished.slice(0, 10)}
            </div>

            <div className="rounded-b-lg p-1 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-100 lg:dark:bg-zinc-800/30 text-sm">
              Written by {recipe.author}
            </div>
          </div>
        </li>
      ))}
    </>
  );
};

export default SearchRecipePreview;
