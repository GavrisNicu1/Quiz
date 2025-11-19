import type { Request, Response, NextFunction } from "express";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  const error = new Error("Route not found");
  (error as Error & { status?: number }).status = 404;
  next(error);
};

export const errorHandler = (
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
