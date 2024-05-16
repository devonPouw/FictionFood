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
  if (!isAllowed) {
    const timeout = 5000;
    setTimeout(() => {
      if (!isAllowed) {
        <Navigate to="/" />;
      }
    }, timeout);
    return !timeout ? (
      <div>Loading authentication data...</div>
    ) : (
      <Navigate to="/" />
    );
  }

  return isAllowed ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
