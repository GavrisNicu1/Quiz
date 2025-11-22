import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getAdminStats = asyncHandler(async (_req: Request, res: Response) => {
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));

  const [ordersToday, revenue, lowStock, pendingProcessingCount, deliveredCount] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
        },
      },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
    }),
    prisma.product.count({ where: { stock: { lt: 5 } } }),
    prisma.order.count({
      where: {
        status: {
          in: ["PENDING", "PROCESSING"],
        },
      },
    }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
  ]);

  res.json({
    orders_today: ordersToday,
    total_revenue: Number(revenue._sum.total ?? 0),
    low_stock_count: lowStock,
    pending_processing_count: pendingProcessingCount,
    delivered_count: deliveredCount,
  });
});
