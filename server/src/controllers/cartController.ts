import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";

import { prisma } from "../config/prisma";
import { emitCartUpdate, getCartForUser } from "../services/cartService";

const ensureUser = (req: Request) => {
  if (!req.user) {
    const error = new Error("Not authenticated");
    (error as Error & { status?: number }).status = 401;
    throw error;
  }
  return req.user;
};

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const user = ensureUser(req);
  const cart = await getCartForUser(user.id);
  res.json({ cart });
});

export const addCartItem = asyncHandler(async (req: Request, res: Response) => {
  const user = ensureUser(req);
  const { productId, quantity } = req.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const cartItem = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    create: { userId: user.id, productId, quantity },
    update: { quantity: { increment: quantity } },
    include: { product: true },
  });

  await emitCartUpdate(user.id);
  res.status(201).json({ item: cartItem });
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const user = ensureUser(req);
  const { id } = req.params;
  const { quantity } = req.body;

  const item = await prisma.cartItem.update({
    where: { id, userId: user.id },
    data: { quantity },
    include: { product: true },
  });

  await emitCartUpdate(user.id);
  res.json({ item });
});

export const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const user = ensureUser(req);
  const { id } = req.params;

  await prisma.cartItem.delete({ where: { id, userId: user.id } });
  await emitCartUpdate(user.id);
  res.status(204).send();
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const user = ensureUser(req);
  await prisma.cartItem.deleteMany({ where: { userId: user.id } });
  await emitCartUpdate(user.id);
  res.json({ message: "Cart cleared" });
});
