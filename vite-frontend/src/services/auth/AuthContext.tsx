import React, { createContext, useState, ReactNode, useCallback } from "react";
import { AccountType, accountType } from "@/services/Paths";
import { IUser } from "@/types/User";
import { parseJwt } from "../ApiMappings";
import { removeRefreshToken } from "../auth/cookieHelper";

interface AuthContextProps {
  user: IUser | null;
  userIsAuthenticated: () => boolean;
  userLogin: (token: string, refreshToken: string) => void;
  userLogout: () => void;
  getAccountType: () => AccountType;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  const userLogout = useCallback((): void => {
    removeRefreshToken();
    setUser(null);
  }, []);

  const loginUserWithToken = useCallback(
    (token: string) => {
      // Check if the token is truthy before proceeding
      if (!token) {
        console.log("Token is undefined or null, aborting login.");
        return;
      }
      console.table("token = " + token);
      const decodedToken = parseJwt(token);
      if (decodedToken && decodedToken.exp > Date.now() / 1000) {
        setUser(decodedToken as IUser);
      } else {
        userLogout();
      }
    },
    [userLogout]
  );

  const userIsAuthenticated = useCallback((): boolean => !!user, [user]);

  const userLogin = useCallback(
    (accessToken: string): void => {
      loginUserWithToken(accessToken);
    },
    [loginUserWithToken]
  );

  const getAccountType = useCallback(
    (): AccountType => (user ? user.role : accountType.VISITOR),
    [user]
  );

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
};

export default AuthContext;

export { AuthProvider };
