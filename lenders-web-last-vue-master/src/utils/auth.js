import Cookies from 'js-cookie';

const TokenKey = 'vue_admin_template_token';
const userInfoKey = 'vue_admin_template_userinfo';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  // if(typeof(Cookies.get(userInfoKey))=='string')
  // return JSON.parse(Cookies.get(userInfoKey));
  // else return Cookies.get(userInfoKey)
  const userInfoStr = localStorage.getItem(userInfoKey);
  return JSON.parse(userInfoStr);
}

export function setUserInfo(userInfo) {
  return localStorage.setItem(userInfoKey, JSON.stringify(userInfo));
  // return Cookies.set(userInfoKey, JSON.stringify(userInfo));
}

export function removeUserInfo() {
  // return Cookies.remove(userInfoKey);
  return localStorage.removeItem(userInfoKey);
}
