import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";

import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { signAccessToken } from "../services/tokenService";
import { env } from "../config/env";
import type { RoleType } from "../types/express";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 2,
};

const serializeUser = (user: { id: string; email: string; name: string; role: string }) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role || "USER",
    },
  });

  const token = signAccessToken({ id: user.id, email: user.email, role: user.role as RoleType });

  res.cookie(env.cookieName, token, cookieOptions);
  res.status(201).json({ user: serializeUser(user), token });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = signAccessToken({ id: user.id, email: user.email, role: user.role as RoleType });
  res.cookie(env.cookieName, token, cookieOptions);
  res.json({ user: serializeUser(user), token });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ user: serializeUser(user) });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.cookieName);
  res.json({ message: "Logged out" });
});
