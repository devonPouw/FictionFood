import { ThemeProvider } from "@/components/theme-provider"
import Header from "./components/header/Header"
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import { useContext } from "react";
import { AuthContext } from "./services/auth/auth-context";
import AddRecipe from "./components/recipe/AddRecipe";
import Register from "./pages/RegisterPage";
import Profile from "./components/auth/Profile";
import Footer from "./components/footer/Footer";

const PrivateRoute = () => {
  const {authenticated} = useContext(AuthContext)

  if(!authenticated) return <Navigate to='/home' replace />

  return <Outlet />
}

const router = createBrowserRouter([
  { path: "*", Component: Root },
]);

 const App = () => {
  return <RouterProvider router={router} />;
}
function Root() {
 
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
       <Header />
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/profile" element={<Profile />} />
    <Route element={<PrivateRoute />} />
    <Route path="/" element={<Home />} />
    <Route path="recipes/new" element={<AddRecipe />} />
  </Routes>
  <Footer />
  </ThemeProvider>
);
}
    
export default App
    
