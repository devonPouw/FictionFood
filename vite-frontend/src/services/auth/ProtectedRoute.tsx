import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
  page: React.ReactNode;
  allowedAccountTypes: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  page,
  allowedAccountTypes,
}) => {
  const { getAccountType } = useAuth();
  const accountType = getAccountType();

  const isAllowed = allowedAccountTypes.includes(accountType);

  return isAllowed ? page : <Navigate to="/" />;
};

export default ProtectedRoute;
