import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
export const http = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});
http.interceptors.request.use((config) => {
    const token = localStorage.getItem("quizshop-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem("quizshop-token", token);
    }
    else {
        localStorage.removeItem("quizshop-token");
    }
};
export const getStoredToken = () => localStorage.getItem("quizshop-token") ?? undefined;
