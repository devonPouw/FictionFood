import { IRecipeData, IRecipeList } from "@/types/Recipe";
import axios from "axios";

export const backendApi = {
  register,
  login,
  logout,
  getAllRecipes,
  getRecipeById,
  postRecipe,
};

function register(
  role: string,
  nickname: string,
  username: string,
  email: string,
  password: string
) {
  return http.post("/auth/register", {
    role,
    nickname,
    username,
    email,
    password,
  });
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

const http = axios.create({
  baseURL: "https://localhost:8443/api",
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle logout, redirect to login page, or show a modal, etc.
      console.error("Session expired or unauthorized. Redirecting to login.");
      // Implement redirection or logout logic here
    }
    return Promise.reject(error);
  }
);

// export function parseJwt(token: string) {
//   try {
//     if (!token) {
//       return null;
//     }

//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace("-", "+").replace("_", "/");
//     return JSON.parse(window.atob(base64));
//   } catch (error) {
//     console.error("Error parsing JWT:", error);
//     return null;
//   }
// }
