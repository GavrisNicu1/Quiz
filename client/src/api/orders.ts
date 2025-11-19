import { http } from "./http";
import type { Order } from "../types";

const normalizeOrder = (order: Order) => ({
  ...order,
  total: Number(order.total),
  items: order.items.map((item) => ({
    ...item,
    price: Number(item.price),
  })),
});

export const fetchOrders = async () => {
  const { data } = await http.get<{ orders: Order[] }>("/api/orders");
  return data.orders.map(normalizeOrder);
};

export const checkoutOrder = async (payload: { shippingAddress: string }) => {
  const { data } = await http.post<{ order: Order }>("/api/orders/checkout", payload);
  return normalizeOrder(data.order);
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { data } = await http.patch<{ order: Order }>(`/api/orders/${id}/status`, { status });
  return normalizeOrder(data.order);
};
