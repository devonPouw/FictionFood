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
    headers: {
      "Content-type": "application/json",
    },
  });
}

function login(username: string, password: string) {
  return http.post("/auth/login", {
    username,
    password,
    headers: {
      "Content-type": "application/json",
    },
  });
}

function logout(token: string) {
  return http.post("/auth/logout", {
    headers: {
      Authorization: bearer(token),
      "Content-type": "application/json",
    },
  });
}

function getAllRecipes(page: number, amount: number) {
  return http.get<IRecipeList>(
    "/recipes" + "?page=" + page + "&size=" + amount
  );
}

function getRecipeById(id: number, token: string) {
  return http.get<IRecipeData>(`/recipes/${id}`, {
    headers: {
      Authorization: bearer(token),
    },
  });
}

function postRecipe(formData: FormData, token: string) {
  return http.post("/recipes", formData, {
    headers: {
      Authorization: bearer(token),
    },
  });
}

const http = axios.create({
  baseURL: "http://localhost:8080/api",
  // withCredentials: true,
});

http.interceptors.request.use(
  function (config) {
    // If token is expired, redirect user to login
    if (config.headers.Authorization) {
      const token = (config.headers.Authorization as string).split(" ")[1];
      try {
        const decodedToken = parseJwt(token);
        if (Date.now() > decodedToken.exp * 1000) {
          return Promise.reject(new Error("Token expired"));
        }
      } catch (error) {
        // Handle token verification error, e.g., token is invalid
        return Promise.reject(error);
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

function bearer(token: string) {
  return `Bearer ${token}`;
}
