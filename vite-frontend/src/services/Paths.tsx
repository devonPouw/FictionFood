import Profile from "@/pages/Profile";
import AddRecipe from "@/components/recipe/AddRecipe";
import RecipeList from "@/components/recipe/RecipeList";
import Home from "@/pages/Home";
import Login from "@/pages/LoginPage";
import Recipe from "@/pages/Recipe";
import Register from "@/pages/RegisterPage";
import ChangePassword from "@/components/auth/ChangePassword";
import RecipeListByUser from "@/components/recipe/RecipeListByUser";

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
    path: "/profile/change-password",
    allowedAccountTypes: loggedInTypes,
    element: () => <ChangePassword />,
  },
  {
    path: "/recipes",
    allowedAccountTypes: allAccountTypes,
    element: () => <RecipeList />,
  },
  {
    path: "/recipes/me",
    allowedAccountTypes: loggedInTypes,
    element: () => <RecipeListByUser />,
  },
  {
    path: "/recipes/:id",
    allowedAccountTypes: allAccountTypes,
    element: () => <Recipe />,
  },
  {
    path: "/recipes/new",
    allowedAccountTypes: loggedInTypes,
    element: () => <AddRecipe />,
  },
];
