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
  baseURL: import.meta.env.VITE_HTTPS_BACKEND,
  // withCredentials: true,
});

http.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = parseJwt(token);
        if (decodedToken && Date.now() <= decodedToken.exp * 1000) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Token is expired or invalid, remove it from sessionStorage
          sessionStorage.removeItem("token");
          // Optionally, redirect to login or handle token expiration appropriately here
          console.error("Token expired. Please login again.");
        }
      } catch (error) {
        console.error("Token not found", error);
        sessionStorage.removeItem("token");
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

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
