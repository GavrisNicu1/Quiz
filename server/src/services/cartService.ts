import { prisma } from "../config/prisma";
import { getIOIfAvailable } from "./socket";

export const getCartForUser = async (userId: string) =>
  prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

export const emitCartUpdate = async (userId: string) => {
  const cart = await getCartForUser(userId);
  const io = getIOIfAvailable();
  if (io) {
    io.to(`cart:${userId}`).emit("cart:update", cart);
  }
};
