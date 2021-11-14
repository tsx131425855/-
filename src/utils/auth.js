import Cookies from "js-cookie";

// const TokenKey = localStorage.getItem("Token")
const TokenKey = "Token";

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
