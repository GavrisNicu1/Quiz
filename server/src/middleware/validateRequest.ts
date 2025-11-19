import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject } from "zod";

export const validateRequest = (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const error = new Error(result.error.issues.map((issue) => issue.message).join(", "));
      (error as Error & { status?: number }).status = 422;
      throw error;
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;
    next();
  };
