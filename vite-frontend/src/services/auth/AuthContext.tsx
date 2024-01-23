import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AccountType, accountType } from "@/services/Paths";
import { IUser } from "@/types/User";
import { parseJwt } from "../ApiMappings";

interface AuthContextProps {
  user: IUser | null;
  userIsAuthenticated: () => boolean;
  userLogin: (token: string) => void;
  userLogout: () => void;
  getAccountType: () => AccountType;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");

    if (storedToken) {
      try {
        const decodedToken = parseJwt(storedToken);
        setUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        userLogout();
      }
    }
  }, []);

  const userIsAuthenticated = () => {
    return !!user;
  };

  const userLogin = (token: string) => {
    sessionStorage.setItem("token", token);
    const decodedToken = parseJwt(token);
    console.log(decodedToken);
    setUser(decodedToken);
  };

  const userLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  const getAccountType = (): AccountType => {
    return user ? user.role : accountType.VISITOR;
  };

  const contextValue: AuthContextProps = {
    user,
    userIsAuthenticated,
    userLogin,
    userLogout,
    getAccountType,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthContext;

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider };
