import { z } from "zod";

const toNumber = (value: unknown) => {
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
};

const baseProduct = {
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.preprocess(toNumber, z.number().positive()),
  imageUrl: z.string().url(),
  stock: z.preprocess(toNumber, z.number().int().nonnegative()).default(0),
  category: z.string().min(3).max(50).optional(),
  subcategory: z.string().min(3).max(50).optional(),
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
