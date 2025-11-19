import { http } from "./http";
import type { CartItem } from "../types";

const normalizeCartItem = (item: CartItem) => ({
  ...item,
  product: {
    ...item.product,
    price: Number(item.product.price),
  },
});

export const fetchCart = async () => {
  const { data } = await http.get<{ cart: CartItem[] }>("/api/cart");
  return data.cart.map(normalizeCartItem);
};

export const addCartItem = async (payload: { productId: string; quantity: number }) => {
  const { data } = await http.post<{ item: CartItem }>("/api/cart/items", payload);
  return normalizeCartItem(data.item);
};

export const updateCartItem = async (id: string, payload: { quantity: number }) => {
  const { data } = await http.patch<{ item: CartItem }>(`/api/cart/items/${id}`, payload);
  return normalizeCartItem(data.item);
};

export const removeCartItem = async (id: string) => {
  await http.delete(`/api/cart/items/${id}`);
};

export const clearCart = async () => {
  await http.delete("/api/cart/items");
};
