import Profile from "@/components/auth/Profile";
import AddRecipe from "@/components/recipe/AddRecipe";
import Home from "@/pages/Home";
import Login from "@/pages/LoginPage";
import Recipe from "@/pages/Recipe";
import Recipes from "@/pages/Recipes";
import Register from "@/pages/RegisterPage";

export type AccountType = "MODERATOR" | "CHEF" | "VISITOR";

export const accountType: { [key in AccountType]: AccountType } = {
  MODERATOR: "MODERATOR",
  CHEF: "CHEF",
  VISITOR: "VISITOR",
};

const loggedInTypes: AccountType[] = ["MODERATOR", "CHEF"];
const allAccountTypes: AccountType[] = [...loggedInTypes, "VISITOR"];

export const navList = [
  {
    path: "/",
    allowedAccountTypes: allAccountTypes,
    element: () => <Home />,
  },
  {
    path: "/register",
    allowedAccountTypes: ["VISITOR"],
    element: () => <Register />,
  },
  {
    path: "/login",
    allowedAccountTypes: ["VISITOR"],
    element: () => <Login />,
  },
  {
    path: "/profile",
    allowedAccountTypes: loggedInTypes,
    element: () => <Profile />,
  },
  {
    path: "/recipes",
    allowedAccountTypes: allAccountTypes,
    element: () => <Recipes />,
  },
  {
    path: "/recipes/:recipeId",
    allowedAccountTypes: allAccountTypes,
    element: () => <Recipe />,
  },
  {
    path: "/recipes/new",
    allowedAccountTypes: loggedInTypes,
    element: () => <AddRecipe />,
  },
];
