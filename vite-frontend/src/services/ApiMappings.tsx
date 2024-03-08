import { IRecipeData, IRecipeList } from "@/types/Recipe";
import axios from "axios";

export const backendApi = {
  register,
  login,
  logout,
  refreshToken,
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

function refreshToken(refreshToken: string | null) {
  return basicHttp.post("/auth/refresh-token", { refreshToken });
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

const baseURL = import.meta.env.VITE_HTTPS_BACKEND;
const http = axios.create({ baseURL });
const basicHttp = axios.create({ baseURL });

http.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if (token && refreshToken) {
      try {
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error(error);
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return backendApi
        .refreshToken(localStorage.getItem("refreshToken"))
        .then((res) => {
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          sessionStorage.setItem("token", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          return http(originalRequest);
        })
        .catch((refreshError) => {
          console.error("Refresh token failed:", refreshError);
          sessionStorage.removeItem("token");
          return Promise.reject(error);
        });
    }

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
