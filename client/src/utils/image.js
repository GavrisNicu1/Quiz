const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
export const resolveImageUrl = (url) => {
    if (!url) {
        return "";
    }
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
};
