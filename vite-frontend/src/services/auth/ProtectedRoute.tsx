import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
  allowedAccountTypes: string[];
  children: ReactElement | ReactElement[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedAccountTypes,
  children,
}) => {
  const { getAccountType } = useAuth();
  const accountType = getAccountType();
  const isAllowed = allowedAccountTypes.includes(accountType);
  if (!isAllowed) return <div>Loading authentication data...</div>;

  return isAllowed ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
