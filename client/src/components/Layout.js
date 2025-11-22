import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
const Layout = () => {
    const { user, logout } = useAuth();
    const { count } = useCart();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };
    return (_jsxs("div", { className: "app-shell", children: [_jsx("header", { children: _jsx("div", { className: "container", children: _jsxs("nav", { children: [_jsx(Link, { to: "/", className: "logo", children: "G Shop" }), _jsxs("ul", { children: [_jsx("li", { children: _jsx(NavLink, { to: "/", children: "Produse" }) }), user && (_jsxs(_Fragment, { children: [_jsx("li", { children: _jsxs(NavLink, { to: "/cart", className: "cart-link", children: ["Co\u0219", count > 0 && _jsx("span", { className: "cart-badge", children: count })] }) }), _jsx("li", { children: _jsx(NavLink, { to: "/orders", children: "Comenzile mele" }) })] })), user?.role === "ADMIN" && (_jsx("li", { children: _jsx(NavLink, { to: "/admin", children: "Admin" }) })), !user ? (_jsxs(_Fragment, { children: [_jsx("li", { children: _jsx(NavLink, { to: "/login", children: "Autentificare" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/register", children: "\u00CEnregistrare" }) })] })) : (_jsx("li", { children: _jsx("button", { className: "secondary-btn", onClick: handleLogout, children: "Delogare" }) }))] })] }) }) }), _jsx("main", { className: "container", children: _jsx(Outlet, {}) })] }));
};
export default Layout;
