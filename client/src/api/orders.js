import { http } from "./http";
const normalizeOrder = (order) => ({
    ...order,
    total: Number(order.total),
    items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
    })),
});
export const fetchOrders = async () => {
    const { data } = await http.get("/api/orders");
    return data.orders.map(normalizeOrder);
};
export const checkoutOrder = async (payload) => {
    const { data } = await http.post("/api/orders/checkout", payload);
    return normalizeOrder(data.order);
};
export const updateOrderStatus = async (id, status) => {
    const { data } = await http.patch(`/api/orders/${id}/status`, { status });
    return normalizeOrder(data.order);
};
