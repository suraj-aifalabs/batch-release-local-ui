import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getFullNameFromCookie = () => cookies.get("user_fullname");

export const getUsernameFromCookie = () => cookies.get("username");

export const getAccessTokenFromCookie = () => cookies.get("msal_access_token");

export const getIdTokenFromCookie = () => cookies.get("msal_id_token");

