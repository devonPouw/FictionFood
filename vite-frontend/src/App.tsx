
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { navList } from "./services/Paths";
import ProtectedRoute from "./services/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
          <Routes>
            {navList.map((nav) => (
              <Route
                key={nav.path}
                path={nav.path}
                element={
                  <ProtectedRoute
                    page={nav.element()}
                    allowedAccountTypes={nav.allowedAccountTypes}
                  />
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;
    
