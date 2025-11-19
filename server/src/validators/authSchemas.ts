import { z } from "zod";

const email = z.string().email();
const password = z.string().min(6);

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email,
    password,
    role: z.enum(["USER", "ADMIN"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password,
  }),
});
