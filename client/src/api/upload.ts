import { http } from "./http";

export const uploadProductImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await http.post<{ imageUrl: string }>("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.imageUrl;
};
