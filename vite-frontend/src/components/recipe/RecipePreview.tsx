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
    <div className="flex flex-row pt-10 px-10">
      {recipes.map((recipe) => (
        <div className="w-1/4 h-1/4" key={recipe.title}>
          <div>
            <span className="flex text-xl font-semibold justify-center">{recipe.title}</span>
          </div>
          <div className="flex justify-end">
            {recipe.categories.map((category) => (
              <div className="bg-slate-400 rounded-lg p-1 m-2 text-sm" key={category}>{category}</div>
            ))}
          </div>
          <div>{recipe.rating}</div>
          <img className="h-auto w-full" src={imageSrcList[recipe.title]} alt="" />
          <div>{recipe.summary}</div>
          
          <div>{recipe.datePublished}</div>
          
          <div>{recipe.author}</div>
        </div>
      ))}
    </div>
  );
};

export default RecipePreview;
