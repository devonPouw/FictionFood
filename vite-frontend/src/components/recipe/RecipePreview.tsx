import { IRecipeList } from "@/types/Recipe";
import { useState, useEffect } from "react";

interface RecipeProps {
  recipeList: IRecipeList;
}

const RecipePreview: React.FC<RecipeProps> = ({ recipeList }) => {
  const { recipes } = recipeList;
  const [imageSrcList, setImageSrcList] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      if (recipes) {
        const promises = recipes.map(async (recipe) => {
          if (recipe.imageData) {
            const blob = new Blob([recipe.imageData], { type: 'image/jpeg' });
            const base64String = await getBase64FromBlob(blob);
            return { [recipe.title]: base64String };
          }
          return {};
        });

        const imageSrcArray = await Promise.all(promises);
        const newImageSrcList: Record<string, string> = Object.assign({}, ...imageSrcArray);
        
        console.table(newImageSrcList);
        setImageSrcList(newImageSrcList);
      }
    };

    fetchImages();
  }, [recipes]);

  const getBase64FromBlob = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        }
      };
      reader.readAsDataURL(blob);
    });
  };

  return !recipes ? (
    <div>loading...</div>
  ) : (
    <div className="flex flex-row pt-10 px-10">
      {recipes.map((recipe) => (
        <div className="w-1/4 h-20" key={recipe.title}>
          <div>
            <span>{recipe.title}</span>
          </div>
          <div>{recipe.rating}</div>
          <img src={imageSrcList[recipe.title]} alt="" />
          <div>{recipe.summary}</div>
          <div>{recipe.author}</div>
          <div>{recipe.datePublished}</div>
          <div>
            {recipe.categories.map((category) => (
              <div key={category}>{category}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipePreview;
