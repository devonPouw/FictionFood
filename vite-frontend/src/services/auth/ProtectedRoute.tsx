import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth-context";

export const ProtectedRoute = () => {
    const { token } = useAuth();

    return token ? <Outlet /> : <Navigate to="/" />;
  };