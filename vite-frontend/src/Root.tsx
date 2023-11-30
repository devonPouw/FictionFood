
import { ThemeProvider } from "@/components/theme-provider"
import Header from "./components/header/Header"
import {
  createBrowserRouter,
  Link,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";

const router = createBrowserRouter([
  { path: "*", Component: Root },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
function Root() {
  
 
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
       <Header />
    <Routes>
    <Route path="/" element={<Home />} />
    {/* <Route path="/blog/*" element={<BlogApp />} />
    <Route path="/users/*" element={<UserApp />} /> */}
  </Routes>
  </ThemeProvider>
);
}
    
     
    
