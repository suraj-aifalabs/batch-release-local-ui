import Cookies from "universal-cookie";
const cookies = new Cookies();

const SECURE_IDS = {
    msal_id_token: "91b84dd50961309e2720e24903e1e6cd",
    msal_access_token: "d95ec1a6c067bdc116d48fcc923c7c75",
    username: "368bf182bbac3104e48cbe3213c3af50",
    user_fullname: "10ec2c8cd682a81da2adff0e0cc9660a",
    browser_id: "eab1a3a68fd07cfadb5f81da550b567b"
} as const;

export const getFullNameFromCookie = () => cookies.get(SECURE_IDS["user_fullname"]);

export const getUsernameFromCookie = () => cookies.get(SECURE_IDS["username"]);

export const getAccessTokenFromCookie = () => cookies.get(SECURE_IDS["msal_access_token"]);

export const getIdTokenFromCookie = () => cookies.get(SECURE_IDS["msal_id_token"]);

export const getBrowserIdFromCookie = () => cookies.get(SECURE_IDS["browser_id"]);
