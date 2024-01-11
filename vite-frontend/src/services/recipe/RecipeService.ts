import http from "@/http-common"
import { IRecipeList, IRecipeData } from "@/types/Recipe"

const getAll = (page: number, amount: number) => {
    return http.get<IRecipeList>("/recipes" + "?page=" + page + "&size=" + amount)
}
const get = (id: number) => {
    return http.get<IRecipeData>(`/recipes/${id}`);
  };
  
  const create = (data: IRecipeData) => {
    return http.post<IRecipeData>("/recipes", data);
  };
  
  const update = (id: number, data: IRecipeData) => {
    return http.patch<any>(`/recipes/${id}`, data);
  };
  
  const remove = (id: number) => {
    return http.delete<any>(`/recipes/${id}`);
  };
  const findByTitle = (title: string) => {
    return http.get<Array<IRecipeData>>(`/recipes?title=${title}`);
  };

  const RecipeDataService = {
    getAll,
    get,
    create,
    update,
    remove,
    findByTitle,
  };

  export default RecipeDataService;