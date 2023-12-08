import http from '@/http-common';

export const register = (nickname: string, username: string, email: string, password: string) => {
    return http.post("/auth/register", {
      nickname,
      username,
      email,
      password,
    });
  };
  export const login = async (username: string, password: string) => {
    const response = await http.post("/auth/login", {
      username,
      password,
    });
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  };
  
  export const logout = () => {
    localStorage.removeItem("user");
  };
  
  export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  };