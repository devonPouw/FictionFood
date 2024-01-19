import { IRecipeList } from "@/types/Recipe";
import { useState, useEffect } from "react";

interface RecipePreviewProps {
  recipeList: IRecipeList;
}

const RecipePreview: React.FC<RecipePreviewProps> = ({ recipeList }) => {
  const { recipes } = recipeList;
  const [imageSrcList, setImageSrcList] = useState<Record<string, string>>();

  useEffect(() => {
    const fetchImages = async () => {
      if (recipes) {
        const newImageSrcList: Record<string, string> = {};

        for (const recipe of recipes) {
          if (recipe.imageData) {
            newImageSrcList[recipe.title] = `data:image/jpeg;base64,${recipe.imageData}`;
          }
        }

        console.table(newImageSrcList);
        setImageSrcList(newImageSrcList);
      }
    };

    fetchImages();
  }, [recipes]);
  return !imageSrcList ? (
    <div>loading...</div>
  ) : (
    <div className="w-screen h-auto flex justify-center text-white dark:invert">
    <div className="w-3/4 grid py-4 gap-6 grid-cols-3 justify-items-center">
      {recipes.map((recipe) => (
        <div className="h-auto w-full px-4 py-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-700" key={recipe.title}>
          <div>
            <span className="flex text-xl font-semibold justify-center">{recipe.title}</span>
          </div>
          <div className="flex justify-end">
            {recipe.categories.map((category) => (
              <div className="bg-slate-400 rounded-lg p-1 m-2 text-sm" key={category}>{category}</div>
            ))}
          </div>
          <div>Rating: {recipe.rating} ★</div>
          <div>
          <img className="w-full max-h-[300px] min-h-[300px] object-cover rounded-lg dark:invert" src={imageSrcList[recipe.title]} alt={recipe.title} />
            </div>
          <div className="">{recipe.summary}</div>
        
          <div>Posted: {recipe.datePublished}</div>
          <div className="flex justify-items-end">
          <div>Written by {recipe.author}</div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default RecipePreview;
