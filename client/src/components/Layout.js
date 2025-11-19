import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };
    return (_jsxs("div", { className: "app-shell", children: [_jsx("header", { children: _jsx("div", { className: "container", children: _jsxs("nav", { children: [_jsx(Link, { to: "/", className: "logo", children: "Quiz Shop" }), _jsxs("ul", { children: [_jsx("li", { children: _jsx(NavLink, { to: "/", children: "Produse" }) }), user && (_jsxs(_Fragment, { children: [_jsx("li", { children: _jsx(NavLink, { to: "/cart", children: "Co\u0219" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/orders", children: "Comenzile mele" }) })] })), user?.role === "ADMIN" && (_jsx("li", { children: _jsx(NavLink, { to: "/admin", children: "Admin" }) })), !user ? (_jsxs(_Fragment, { children: [_jsx("li", { children: _jsx(NavLink, { to: "/login", children: "Autentificare" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/register", children: "\u00CEnregistrare" }) })] })) : (_jsx("li", { children: _jsx("button", { className: "secondary-btn", onClick: handleLogout, children: "Delogare" }) }))] })] }) }) }), _jsx("main", { className: "container", children: _jsx(Outlet, {}) })] }));
};
export default Layout;
