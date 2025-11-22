import { http } from "./http";
import type { Product } from "../types";

const normalizeProduct = (product: Product) => ({
  ...product,
  price: Number(product.price),
});

export const listProducts = async () => {
  const { data } = await http.get<{ products: Product[] }>("/api/products");
  return data.products.map(normalizeProduct);
};

export const getProduct = async (id: string) => {
  const { data } = await http.get<{ product: Product }>(`/api/products/${id}`);
  return normalizeProduct(data.product);
};

export const createProduct = async (product: Partial<Product>) => {
  const { data } = await http.post<{ product: Product }>("/api/products", product);
  return normalizeProduct(data.product);
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const { data } = await http.patch<{ product: Product }>(`/api/products/${id}`, product);
  return normalizeProduct(data.product);
};

export const deleteProduct = async (id: string) => {
  await http.delete(`/api/products/${id}`);
};
