import { z } from "zod";

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive().default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({ id: z.string().cuid() }),
  body: z.object({
    quantity: z.number().int().positive(),
  }),
});

export const removeCartItemSchema = z.object({
  params: z.object({ id: z.string().cuid() }),
});
