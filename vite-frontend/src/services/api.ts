import axios from "axios";
import { getAccessToken } from "./auth/cookieHelper";

const http = axios.create({
    baseURL: import.meta.env.VITE_HTTPS_BACKEND,
    withCredentials: true,
  });
  
  http.interceptors.request.use(
   function (config) {
    const accessToken = getAccessToken();
    console.log(accessToken)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
    function (error) {
      return Promise.reject(error);
    }
  );
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config;
  
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        return http
          .post("/auth/refresh-token")
          .then((res) => {
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return http(originalRequest);
          })
          .catch((refreshError) => {
            console.error("Refresh token failed:", refreshError);
  
            // Consider logging out the user or redirecting here if needed
          });
      }
  
      return Promise.reject(error);
    }
  );
  export default http