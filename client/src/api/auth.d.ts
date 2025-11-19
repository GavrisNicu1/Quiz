import type { AuthResponse } from "../types";
export interface Credentials {
    email: string;
    password: string;
}
export interface RegisterPayload extends Credentials {
    name: string;
}
export declare const loginRequest: (payload: Credentials) => Promise<AuthResponse>;
export declare const registerRequest: (payload: RegisterPayload) => Promise<AuthResponse>;
export declare const fetchProfile: () => Promise<{
    user: AuthResponse["user"];
}>;
export declare const logoutRequest: () => Promise<void>;
