import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { listProducts, createProduct, deleteProduct } from "../api/products";
import { fetchOrders, updateOrderStatus } from "../api/orders";
const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const AdminDashboardPage = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { register, handleSubmit, reset, formState: { isSubmitting }, } = useForm({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            imageUrl: "https://placehold.co/400x300",
        },
    });
    const loadData = async () => {
        setError(null);
        try {
            const [productList, orderList] = await Promise.all([listProducts(), fetchOrders()]);
            setProducts(productList);
            setOrders(orderList);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu pot încărca datele");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        void loadData();
    }, []);
    const onCreateProduct = async (values) => {
        try {
            const product = await createProduct(values);
            setProducts((prev) => [product, ...prev]);
            reset();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu pot crea produsul");
        }
    };
    const onDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((product) => product.id !== id));
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu pot șterge produsul");
        }
    };
    const onStatusChange = async (orderId, status) => {
        try {
            const updated = await updateOrderStatus(orderId, status);
            setOrders((prev) => prev.map((order) => (order.id === orderId ? updated : order)));
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu pot actualiza statusul");
        }
    };
    return (_jsxs("section", { children: [_jsxs("header", { children: [_jsx("h1", { children: "Panou administrator" }), _jsx("p", { children: "Administreaz\u0103 catalogul \u0219i comenzile \u00EEn timp real." })] }), loading && _jsx("p", { children: "Se \u00EEncarc\u0103 datele..." }), error && _jsx("div", { className: "alert", children: error }), _jsxs("div", { className: "card", style: { marginBottom: "2rem" }, children: [_jsx("h3", { children: "Adaug\u0103 produs" }), _jsxs("form", { onSubmit: handleSubmit(onCreateProduct), children: [_jsxs("label", { children: ["Nume", _jsx("input", { type: "text", ...register("name", { required: true }) })] }), _jsxs("label", { children: ["Descriere", _jsx("textarea", { ...register("description", { required: true }), rows: 3 })] }), _jsxs("label", { children: ["Pre\u021B (RON)", _jsx("input", { type: "number", step: "0.01", ...register("price", { required: true, min: 0 }) })] }), _jsxs("label", { children: ["Stoc", _jsx("input", { type: "number", ...register("stock", { required: true, min: 0 }) })] }), _jsxs("label", { children: ["Imagine (URL)", _jsx("input", { type: "url", ...register("imageUrl", { required: true }) })] }), _jsx("button", { className: "primary-btn", type: "submit", disabled: isSubmitting, children: isSubmitting ? "Se salvează..." : "Creează produs" })] })] }), !loading && (_jsxs("div", { className: "card-grid", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { children: "Produse existente" }), products.length === 0 ? (_jsx("p", { children: "Nu exist\u0103 produse \u00EEn catalog." })) : (_jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0 }, children: products.map((product) => (_jsxs("li", { style: { display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }, children: [_jsxs("span", { children: [product.name, " \u2013 ", product.price.toFixed(2), " RON"] }), _jsx("button", { className: "secondary-btn", onClick: () => onDeleteProduct(product.id), children: "\u0218terge" })] }, product.id))) }))] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Comenzi" }), orders.length === 0 ? (_jsx("p", { children: "Nu exist\u0103 comenzi." })) : (_jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Total" }), _jsx("th", { children: "Status" })] }) }), _jsx("tbody", { children: orders.map((order) => (_jsxs("tr", { children: [_jsxs("td", { children: [order.id.slice(0, 8), "..."] }), _jsxs("td", { children: [order.total.toFixed(2), " RON"] }), _jsx("td", { children: _jsx("select", { value: order.status, onChange: (e) => onStatusChange(order.id, e.target.value), children: STATUSES.map((status) => (_jsx("option", { value: status, children: status }, status))) }) })] }, order.id))) })] }))] })] }))] }));
};
export default AdminDashboardPage;
