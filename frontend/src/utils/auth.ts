import axios from "axios";
import jwt_decode from "jwt-decode";

const AUTH_TOKEN_KEY = "pongJwt";
const API_URL = "http://localhost:8090";

interface jwt_data {
  exp: number;
  iat: number;
  login: string;
  sub: string;
  twoFactorAuthenticated: boolean;
  twoFactorEnabled: boolean;
}

export function logoutUser() {
  localStorage.removeItem("user");
  clearAuthToken();
}

export function getAuthToken(): jwt_data | null {
  const cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");

    if (AUTH_TOKEN_KEY == cookiePair[0].trim()) {
      return jwt_decode(decodeURIComponent(cookiePair[1]));
    }
  }
  return null;
}

export function is2faEnabled(): boolean {
  const enabled = getAuthToken();
  if (enabled) {
    return enabled.twoFactorEnabled;
  }
  return false;
}

export function is2faAuthenticated(): boolean {
  const authenticated = getAuthToken();
  if (authenticated) {
    return authenticated.twoFactorAuthenticated;
  }
  return false;
}

export function clearAuthToken(): void {
  document.cookie =
    `${AUTH_TOKEN_KEY}=` +
    ";expires=Thu, 01 Jan 1970 00:00:01 GMT;SameSite=None;Secure";
}

export function isLoggedIn(): boolean {
  const authToken = getAuthToken();
  return !!authToken;
}
