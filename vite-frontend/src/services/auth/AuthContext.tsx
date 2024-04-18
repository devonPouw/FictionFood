import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { AccountType, accountType } from "@/types/User";
import { IUser } from "@/types/User";
import { parseJwt } from "../ApiMappings";

interface AuthContextProps {
  user: IUser | null;
  userIsAuthenticated: () => boolean;
  userLogin: (accessToken: string, refreshToken: string) => void;
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

  const userLogout = useCallback((): void => {
    sessionStorage.removeItem("token");
    setUser(null);
  }, []);

  const loginUserWithToken = useCallback(
    (token: string) => {
      // Check if the token is truthy before proceeding
      if (!token) {
        console.log("Token is undefined or null, aborting login.");
        return;
      }
      const decodedToken = parseJwt(token);
      if (localStorage.getItem("refreshToken")) {
        setUser(decodedToken as IUser);
      } else {
        userLogout();
      }
    },
    [userLogout]
  );

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      loginUserWithToken(storedToken);
    }
    console.log("AuthProvider - user updated:", user);
  }, [loginUserWithToken]);

  const userIsAuthenticated = useCallback((): boolean => !!user, [user]);

  const userLogin = useCallback(
    (accessToken: string, refreshToken: string): void => {
      sessionStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      loginUserWithToken(accessToken);
    },
    [loginUserWithToken]
  );

  const getAccountType = useCallback(
    (): AccountType => (user ? user.role : accountType.VISITOR),
    [user]
  );

  const getToken = useCallback(
    (): string | null => sessionStorage.getItem("token"),
    []
  );

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

export { AuthProvider };
