import http from "@/http-common"
import IRecipeData from "@/types/Recipe"

const getAll = () => {
    return http.get<Array<IRecipeData>>("/api/v1/recipes")
}
const get = (id: number) => {
    return http.get<IRecipeData>(`/api/v1/recipes/${id}`);
  };
  
  const create = (data: IRecipeData) => {
    return http.post<IRecipeData>("/api/v1/recipes", data);
  };
  
  const update = (id: number, data: IRecipeData) => {
    return http.put<any>(`/api/v1/recipes/${id}`, data);
  };
  
  const remove = (id: number) => {
    return http.delete<any>(`/api/v1/recipes/${id}`);
  };
  const findByTitle = (title: string) => {
    return http.get<Array<IRecipeData>>(`/api/v1/recipes?title=${title}`);
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