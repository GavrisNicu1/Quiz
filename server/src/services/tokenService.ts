import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { RoleType } from "../types/express";

export interface TokenPayload {
  id: string;
  email: string;
  role: RoleType;
}

const expiresIn = "2h";

export const signAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn });

export const verifyToken = (token: string) =>
  jwt.verify(token, env.jwtSecret) as TokenPayload;
