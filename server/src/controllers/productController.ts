import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";

import { prisma } from "../config/prisma";
import type { Prisma } from "@prisma/client";

// În productController.ts

export const listProducts = asyncHandler(async (_req: Request, res: Response) => {
  console.log("1. A început request-ul pentru produse...");
  
  try {
    // Încercăm să citim din bază
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    console.log("2. Succes! Am găsit " + products.length + " produse.");
    res.json({ products });

  } catch (error) {
    // AICI ESTE CHEIA: Afișăm eroarea completă în consolă
    console.error("------------------------------------------------");
    console.error("🛑 EROARE CRITICĂ PRISMA 🛑");
    console.error(error); 
    console.error("------------------------------------------------");
    
    // Aruncăm eroarea mai departe ca să nu blocăm request-ul, dar acum o vedem în terminal
    res.status(500);
    throw new Error("Nu s-au putut încărca produsele: " + (error as Error).message);
  }
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
  const payload = req.body as Prisma.ProductCreateInput;
  const product = await prisma.product.create({
    data: {
      ...payload,
      category: payload.category ?? "General",
    },
  });
  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const allowedFields: Array<keyof Prisma.ProductUpdateInput> = [
    "name",
    "description",
    "price",
    "stock",
    "imageUrl",
    "category",
  ];

  const data = allowedFields.reduce<Prisma.ProductUpdateInput>((acc, key) => {
    const value = (req.body as Record<string, unknown>)[key as string];
    if (value !== undefined) {
      acc[key] = value as never;
    }
    return acc;
  }, {});

  if (Object.keys(data).length === 0) {
    res.status(400);
    throw new Error("No valid fields provided for update");
  }

  const product = await prisma.product.update({ where: { id }, data });
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
});
