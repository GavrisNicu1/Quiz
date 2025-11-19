import asyncHandler from "express-async-handler";
import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/tokenService";

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

    if (!token) {
      const error = new Error("Missing token");
      (error as Error & { status?: number }).status = 401;
      throw error;
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  }
);

export const authorize = (roles: ("USER" | "ADMIN")[] = ["USER", "ADMIN"]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error("Unauthorized");
      (error as Error & { status?: number }).status = 403;
      throw error;
    }
    next();
  };
