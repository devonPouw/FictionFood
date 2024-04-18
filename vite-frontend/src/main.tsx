import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./services/Layout.tsx";
import Home from "./pages/Home.tsx";
import ProtectedRoute from "./services/auth/ProtectedRoute.tsx";
import Register from "./pages/RegisterPage.tsx";
import RecipeList from "./components/recipe/RecipeList.tsx";
import Recipe from "./pages/Recipe.tsx";
import AddRecipe from "./components/recipe/AddRecipe.tsx";
import ChangePassword from "./components/auth/ChangePassword.tsx";
import Profile from "./pages/Profile.tsx";
import Login from "./pages/LoginPage.tsx";

const loggedInTypes = ["USER", "MODERATOR"];

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: (
          <ProtectedRoute allowedAccountTypes={["VISITOR"]}>
            <Register />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute allowedAccountTypes={["VISITOR"]}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowedAccountTypes={loggedInTypes}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/change-password",
        element: (
          <ProtectedRoute allowedAccountTypes={loggedInTypes}>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "/recipes",
        element: <RecipeList />,
      },
      {
        path: "/recipes/:id",
        element: <Recipe />,
      },
      {
        path: "/recipes/new",
        element: (
          <ProtectedRoute allowedAccountTypes={loggedInTypes}>
            <AddRecipe />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router}></RouterProvider>);
