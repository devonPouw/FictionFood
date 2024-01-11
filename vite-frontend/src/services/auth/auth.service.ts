import http from '@/http-common';

export const register = async (role: string, nickname: string, username: string, email: string, password: string) => {
    try{
  const response = await http.post("/auth/register", {
      role,
      nickname,
      username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Register failed:", error);
      throw error;
  }
  };

  export const login = async (username: string, password: string) => {
    try {
      const response = await http.post("/auth/login", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  
  export const logout = async () => {
    try {
      await http.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  export function parseJwt(token:string | null) {
    if(!token)
    return;
    const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}
