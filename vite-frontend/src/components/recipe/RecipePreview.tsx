import { IRecipeList } from "@/types/Recipe";

interface RecipeProps {
    recipeList: IRecipeList;
  }
const RecipePreview: React.FC<RecipeProps> = ({ recipeList }) => {
    const { recipes } = recipeList;
    
    return !recipes ? (
        <div>loading...</div>
      ) : (
        <div className="flex flex-row pt-10 px-10">
          {recipes.map((recipe) => (
           <div className="w-1/4 h-20" key={recipe.id} >
                <div><span>{recipe.title}</span></div>
                <div>{recipe.summary}</div>
                {/* <div>{recipe.content}</div> */}
                {/* <div>{recipe.author.username}</div> */}
                <div>{recipe.datePublished}</div>
              </div>
          ))}
       </div>
      );
}
export default RecipePreview