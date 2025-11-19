import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import type { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";
import { emitCartUpdate } from "../services/cartService";

type CartItemWithProduct = Prisma.CartItemGetPayload<{ include: { product: true } }>;

const ensureUser = (req: Request) => {
  if (!req.user) {
    const error = new Error("Not authenticated");
    (error as Error & { status?: number }).status = 401;
    throw error;
  }
  return req.user;
};

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const user = ensureUser(req);
  const filter = req.user?.role === "ADMIN" ? {} : { userId: user.id };
  const orders = await prisma.order.findMany({
    where: filter,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
});

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const user = ensureUser(req);
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const total = cartItems.reduce((sum: number, item: CartItemWithProduct) =>
    sum + Number(item.product.price) * item.quantity, 0);

  const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const createdOrder = await tx.order.create({
      data: {
        userId: user.id,
        total,
        status: "PENDING",
        items: {
          create: cartItems.map((item: CartItemWithProduct) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
          })),
        },
      },
      include: { items: true },
    });

    await tx.cartItem.deleteMany({ where: { userId: user.id } });
    return createdOrder;
  });

  await emitCartUpdate(user.id);
  res.status(201).json({ order });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== "ADMIN") {
    res.status(403);
    throw new Error("Only admins can update orders");
  }

  const { id } = req.params;
  const { status } = req.body as { status: string };

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  });

  res.json({ order });
});
