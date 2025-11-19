import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchOrders } from "../api/orders";
const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const load = async () => {
            setError(null);
            try {
                const data = await fetchOrders();
                setOrders(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Nu pot încărca comenzile");
            }
            finally {
                setLoading(false);
            }
        };
        void load();
    }, []);
    return (_jsxs("section", { children: [_jsxs("header", { children: [_jsx("h1", { children: "Comenzile mele" }), _jsx("p", { children: "Urm\u0103re\u0219te statusul pentru fiecare comand\u0103 plasat\u0103." })] }), loading && _jsx("p", { children: "Se \u00EEncarc\u0103..." }), error && _jsx("div", { className: "alert", children: error }), !loading && orders.length === 0 && _jsx("p", { children: "Nu ai comenzi de afi\u0219at." }), !loading && orders.length > 0 && (_jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Data" }), _jsx("th", { children: "Total" }), _jsx("th", { children: "Status" })] }) }), _jsx("tbody", { children: orders.map((order) => (_jsxs("tr", { children: [_jsxs("td", { children: [order.id.slice(0, 8), "..."] }), _jsx("td", { children: new Date(order.createdAt).toLocaleString("ro-RO") }), _jsxs("td", { children: [order.total.toFixed(2), " RON"] }), _jsx("td", { children: _jsx("span", { className: "badge", children: order.status }) })] }, order.id))) })] }))] }));
};
export default OrdersPage;
