import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "./services/auth/auth-context";
import { ProtectedRoute } from "./services/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"
import Home from "./pages/Home";
import Profile from "./components/auth/Profile";
import AddRecipe from "./components/recipe/AddRecipe";
import Recipes from "./pages/Recipes";


const Routes = () => {
    const { token } = useAuth();

  const routesForPublic = [
    {
      path: "/recipes",
      element: <Recipes />,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
            path: "/recipes/new",
            element: <AddRecipe />,
          },
        {
          path: "/logout",
          element: <div>Logout</div>,
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
      },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes