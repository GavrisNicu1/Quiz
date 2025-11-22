import { http } from "./http";
import type { AdminStats } from "../types";

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const { data } = await http.get<{
    orders_today: number;
    total_revenue: number;
    low_stock_count: number;
    pending_processing_count: number;
    delivered_count: number;
  }>("/api/admin/stats");

  return {
    ordersToday: data.orders_today,
    totalRevenue: data.total_revenue,
    lowStockCount: data.low_stock_count,
    pendingProcessingCount: data.pending_processing_count,
    deliveredCount: data.delivered_count,
  };
};
