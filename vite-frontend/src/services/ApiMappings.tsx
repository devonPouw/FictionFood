import { IRecipeData, IRecipeList } from "@/types/Recipe";
import http from "./api";

export const backendApi = {
  register,
  login,
  logout,
  getAllRecipes,
  getRecipeById,
  postRecipe,
};

function register(formData: FormData) {
  return http.post("/auth/register", formData);
}

function login(username: string, password: string) {
  return http.post("/auth/login", {
    username,
    password,
  });
}

function logout() {
  return http.get("/auth/logout");
}

function getAllRecipes(page: number, amount: number) {
  return http.get<IRecipeList>(
    "/recipes" + "?page=" + page + "&size=" + amount
  );
}

function getRecipeById(id: number) {
  return http.get<IRecipeData>(`/recipes/${id}`);
}

function postRecipe(formData: FormData) {
  return http.post("/recipes", formData);
}

export function parseJwt(token: string) {
  try {
    if (!token) {
      return null;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
}
