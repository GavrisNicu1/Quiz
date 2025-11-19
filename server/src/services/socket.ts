import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

import { env } from "../config/env";

let io: Server | undefined;

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: env.corsOrigin,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-cart", (userId: string) => {
      socket.join(`cart:${userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const getIOIfAvailable = () => io;
