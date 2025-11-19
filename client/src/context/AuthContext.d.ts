import type { ReactNode } from "react";
import type { User } from "../types";
export interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (credentials: {
        email: string;
        password: string;
    }) => Promise<void>;
    register: (payload: {
        name: string;
        email: string;
        password: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}
declare const AuthContext: import("react").Context<AuthContextValue>;
export declare const AuthProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export default AuthContext;
