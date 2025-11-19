import { z } from "zod";

const baseProduct = {
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  imageUrl: z.string().url(),
  stock: z.number().int().nonnegative().default(0),
};

export const createProductSchema = z.object({
  body: z.object(baseProduct),
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().cuid() }),
  body: z.object(baseProduct).partial(),
});

export const productIdSchema = z.object({
  params: z.object({ id: z.string().cuid() }),
});
