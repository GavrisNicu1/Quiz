import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const ProtectedRoute = ({ children, roles, redirectTo = "/login" }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return _jsx("p", { children: "Se \u00EEncarc\u0103..." });
    }
    if (!user) {
        return _jsx(Navigate, { to: redirectTo, replace: true });
    }
    if (roles && !roles.includes(user.role)) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
