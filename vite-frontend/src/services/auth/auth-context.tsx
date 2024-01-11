import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AuthContextProps {
  token: string | null;
  setToken: (newToken: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("token"));
  
  const setToken = (newToken: string | null) => {
    setAuthToken(newToken);
  };

  useEffect(() => {
    const setAxiosHeaders = () => {
      if (authToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
        localStorage.setItem('token', authToken);
      } else {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem('token');
      }
    };

    setAxiosHeaders();

    return () => {
      // Cleanup logic, if needed
    };
  }, [authToken]);

  const authContextValue = useMemo(
    () => ({
      token: authToken,
      setToken,
    }),
    [authToken]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;