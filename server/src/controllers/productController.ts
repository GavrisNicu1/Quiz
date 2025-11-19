import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";

import { prisma } from "../config/prisma";

export const listProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ products });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.update({ where: { id }, data: req.body });
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
});
