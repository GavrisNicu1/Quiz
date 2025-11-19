import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["JWT_SECRET", "DATABASE_URL", "PORT", "CORS_ORIGIN", "COOKIE_NAME"] as const;

type RequiredEnv = (typeof requiredEnv)[number];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable ${key}`);
  }
});

export const env = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET as string,
  corsOrigin: process.env.CORS_ORIGIN as string,
  cookieName: process.env.COOKIE_NAME as string,
};
