import type { ReactNode } from "react";
import type { Role } from "../types";
interface ProtectedRouteProps {
    children: ReactNode;
    roles?: Role[];
    redirectTo?: string;
}
declare const ProtectedRoute: ({ children, roles, redirectTo }: ProtectedRouteProps) => import("react/jsx-runtime").JSX.Element;
export default ProtectedRoute;
