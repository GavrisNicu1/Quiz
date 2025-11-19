export type RoleType = "USER" | "ADMIN";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      role: RoleType;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
