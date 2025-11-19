import { http, setAuthToken } from "./http";
import type { AuthResponse } from "../types";

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends Credentials {
  name: string;
}

export const loginRequest = async (payload: Credentials) => {
  const { data } = await http.post<AuthResponse>("/api/auth/login", payload);
  setAuthToken(data.token);
  return data;
};

export const registerRequest = async (payload: RegisterPayload) => {
  const { data } = await http.post<AuthResponse>("/api/auth/register", payload);
  setAuthToken(data.token);
  return data;
};

export const fetchProfile = async () => {
  const { data } = await http.get<{ user: AuthResponse["user"] }>("/api/auth/me");
  return data;
};

export const logoutRequest = async () => {
  await http.post("/api/auth/logout", {});
  setAuthToken(undefined);
};
