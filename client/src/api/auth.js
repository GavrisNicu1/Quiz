import { http, setAuthToken } from "./http";
export const loginRequest = async (payload) => {
    const { data } = await http.post("/api/auth/login", payload);
    setAuthToken(data.token);
    return data;
};
export const registerRequest = async (payload) => {
    const { data } = await http.post("/api/auth/register", payload);
    setAuthToken(data.token);
    return data;
};
export const fetchProfile = async () => {
    const { data } = await http.get("/api/auth/me");
    return data;
};
export const logoutRequest = async () => {
    await http.post("/api/auth/logout", {});
    setAuthToken(undefined);
};
