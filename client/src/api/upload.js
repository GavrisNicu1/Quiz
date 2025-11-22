import { http } from "./http";
export const uploadProductImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await http.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.imageUrl;
};
