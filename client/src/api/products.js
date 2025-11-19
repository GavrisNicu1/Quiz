import { http } from "./http";
const normalizeProduct = (product) => ({
    ...product,
    price: Number(product.price),
});
export const listProducts = async () => {
    const { data } = await http.get("/api/products");
    return data.products.map(normalizeProduct);
};
export const createProduct = async (product) => {
    const { data } = await http.post("/api/products", product);
    return normalizeProduct(data.product);
};
export const updateProduct = async (id, product) => {
    const { data } = await http.patch(`/api/products/${id}`, product);
    return normalizeProduct(data.product);
};
export const deleteProduct = async (id) => {
    await http.delete(`/api/products/${id}`);
};
