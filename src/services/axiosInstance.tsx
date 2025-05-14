import axios from "axios";
import { baseURL } from "./apiCalls.tsx";

const axiosInstance = axios.create({
    baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("msal_id_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response?.data?.message === "Session Expired") {
            sessionStorage.clear();
            window.location.href = "/session-expired";
        }
        // if (error.response && error.response.status === 404) {
        //     window.location.href = "/not-found";
        // }

        return Promise.reject(error);
    }
);

export default axiosInstance;
