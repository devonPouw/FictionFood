import Cookies from "js-cookie";

const refreshTokenCookieName = "refreshToken";
const accessTokenCookieName = "accessToken";

export function getRefreshToken() {
  return Cookies.get(refreshTokenCookieName);
}
export function setRefreshToken(token: string) {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // Example:  Expires in 1 hour

  const cookieOptions = {
      expires, 
      Secure: true,  
      HttpOnly: true,
      Path: '/' 
  }; 

  Cookies.set(refreshTokenCookieName, token, cookieOptions); 
}

export function removeRefreshToken() {
  Cookies.remove(refreshTokenCookieName);
}
export function setAccessToken(token: string) {
  const expires = new Date(Date.now() + 60 * 60 * 100); // Example:  Expires in 1 hour

  const cookieOptions = {
      expires, 
      Secure: true,  
      HttpOnly: true,
      Path: '/' 
  }; 

  Cookies.set(accessTokenCookieName, token, cookieOptions); 
}

export function getAccessToken() {
  return Cookies.get(accessTokenCookieName);
}