import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { AccountType, accountType } from "@/services/Paths";
import { IUser } from "@/types/User";

interface AuthContextProps {
  user: IUser | null;
  userIsAuthenticated: () => boolean;
  userLogin: (token: string) => void;
  userLogout: () => void;
  getAccountType: () => AccountType;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const userIsAuthenticated = (): boolean => !!user;

  const userLogin = (token: string): void => {
    sessionStorage.setItem("token", token);
  };

  const userLogout = (): void => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  const getAccountType = (): AccountType =>
    user ? user.role : accountType.VISITOR;

  const getToken = (): string | null => sessionStorage.getItem("token");

  const contextValue: AuthContextProps = {
    user,
    userIsAuthenticated,
    userLogin,
    userLogout,
    getAccountType,
    getToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider };
