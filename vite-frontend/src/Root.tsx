
import { ThemeProvider } from "@/components/theme-provider"
import Header from "./components/header/Header"
import {
  createBrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useContext } from "react";
import { AuthContext } from "./misc/AuthContext";
import AddRecipe from "./components/recipe/AddRecipe";

type Props = {}

const PrivateRroutes = () => {
  const {authenticated} = useContext(AuthContext)

  if(!authenticated) return <Navigate to='/home' replace />

  return <Outlet />
}

const router = createBrowserRouter([
  { path: "*", Component: Root },
]);

 const App = (props: Props) => {
  return <RouterProvider router={router} />;
}
function Root() {
 
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
       <Header />
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<PrivateRroutes />} />
    <Route path="/" element={<Home />} />
    <Route path="recipes/new" element={<AddRecipe />} />
  </Routes>
  </ThemeProvider>
);
}
    
export default App
    
