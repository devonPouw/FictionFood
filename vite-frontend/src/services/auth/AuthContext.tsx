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
import { parseJwt } from "../ApiMappings";

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

  const loginUserWithToken = useCallback((token: string) => {
    try {
      const decodedToken = parseJwt(token);
      if (decodedToken && typeof decodedToken === "object") {
        console.log(decodedToken);

        const user = decodedToken as IUser;
        setUser(user);
      } else {
        throw new Error("Decoded token is not an object.");
      }
    } catch (error) {
      console.error("Invalid token or error parsing JWT:", error);
      userLogout();
    }
  }, []);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      loginUserWithToken(storedToken);
    }
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [loginUserWithToken]);

  const userIsAuthenticated = (): boolean => !!user;

  const userLogin = (token: string): void => {
    sessionStorage.setItem("token", token);
    loginUserWithToken(token);
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
