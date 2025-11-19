import { z } from "zod";

export const checkoutSchema = z.object({
  body: z.object({
    shippingAddress: z.string().min(10),
    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({ id: z.string().cuid() }),
  body: z.object({
    status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  }),
});
