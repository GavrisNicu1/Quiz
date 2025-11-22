import { http } from "./http";
export const fetchAdminStats = async () => {
    const { data } = await http.get("/api/admin/stats");
    return {
        ordersToday: data.orders_today,
        totalRevenue: data.total_revenue,
        lowStockCount: data.low_stock_count,
        pendingProcessingCount: data.pending_processing_count,
        deliveredCount: data.delivered_count,
    };
};
