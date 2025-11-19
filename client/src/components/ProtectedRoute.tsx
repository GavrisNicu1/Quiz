import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Role[];
  redirectTo?: string;
}

const ProtectedRoute = ({ children, roles, redirectTo = "/login" }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Se încarcă...</p>;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
