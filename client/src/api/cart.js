import { http } from "./http";
const normalizeCartItem = (item) => ({
    ...item,
    product: {
        ...item.product,
        price: Number(item.product.price),
    },
});
export const fetchCart = async () => {
    const { data } = await http.get("/api/cart");
    return data.cart.map(normalizeCartItem);
};
export const addCartItem = async (payload) => {
    const { data } = await http.post("/api/cart/items", payload);
    return normalizeCartItem(data.item);
};
export const updateCartItem = async (id, payload) => {
    const { data } = await http.patch(`/api/cart/items/${id}`, payload);
    return normalizeCartItem(data.item);
};
export const removeCartItem = async (id) => {
    await http.delete(`/api/cart/items/${id}`);
};
export const clearCart = async () => {
    await http.delete("/api/cart/items");
};
