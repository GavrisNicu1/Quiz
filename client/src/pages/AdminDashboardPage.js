import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { listProducts, createProduct, deleteProduct, updateProduct } from "../api/products";
import { fetchOrders, updateOrderStatus } from "../api/orders";
import { uploadProductImage } from "../api/upload";
import { fetchAdminStats } from "../api/admin";
import { resolveImageUrl } from "../utils/image";
const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const DEFAULT_IMAGE = "https://placehold.co/400x300";
const DEFAULT_FORM_VALUES = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: DEFAULT_IMAGE,
    category: "",
};
const AdminDashboardPage = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting }, } = useForm({
        defaultValues: { ...DEFAULT_FORM_VALUES },
    });
    const imageUrlValue = watch("imageUrl");
    const isEditing = Boolean(editingProductId);
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [productList, orderList, statsData] = await Promise.all([
                listProducts(),
                fetchOrders(),
                fetchAdminStats(),
            ]);
            setProducts(productList);
            setOrders(orderList);
            setStats(statsData);
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
    const resetForm = () => {
        reset({ ...DEFAULT_FORM_VALUES });
        setEditingProductId(null);
    };
    const parsePayload = (values) => ({
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
        category: values.category?.trim() ? values.category.trim() : undefined,
    });
    const onSubmitProduct = async (values) => {
        try {
            const payload = parsePayload(values);
            if (isEditing && editingProductId) {
                const updated = await updateProduct(editingProductId, payload);
                setProducts((prev) => prev.map((product) => (product.id === updated.id ? updated : product)));
            }
            else {
                const created = await createProduct(payload);
                setProducts((prev) => [created, ...prev]);
            }
            resetForm();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu pot salva produsul");
        }
    };
    const onDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((product) => product.id !== id));
            if (editingProductId === id) {
                resetForm();
            }
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
    const onEditProduct = (product) => {
        setEditingProductId(product.id);
        reset({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl,
            category: product.category ?? "",
        });
    };
    const onCancelEdit = () => {
        resetForm();
    };
    const onImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        setUploadingImage(true);
        try {
            const imageUrl = await uploadProductImage(file);
            setValue("imageUrl", imageUrl, { shouldDirty: true });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu pot încărca imaginea");
        }
        finally {
            setUploadingImage(false);
            event.target.value = "";
        }
    };
    return (_jsxs("section", { children: [_jsxs("header", { children: [_jsx("h1", { children: "Panou administrator" }), _jsx("p", { children: "Administreaz\u0103 catalogul \u0219i comenzile \u00EEn timp real." })] }), loading && _jsx("p", { children: "Se \u00EEncarc\u0103 datele..." }), error && _jsx("div", { className: "alert", children: error }), stats && (_jsxs("div", { className: "card-grid", style: { marginBottom: "2rem" }, children: [_jsxs("div", { className: "card", children: [_jsx("h4", { children: "Comenzi ast\u0103zi" }), _jsx("p", { style: { fontSize: "1.5rem", fontWeight: 600 }, children: stats.ordersToday })] }), _jsxs("div", { className: "card", children: [_jsx("h4", { children: "Venit total" }), _jsxs("p", { style: { fontSize: "1.5rem", fontWeight: 600 }, children: [stats.totalRevenue.toFixed(2), " RON"] })] }), _jsxs("div", { className: "card", children: [_jsx("h4", { children: "Comenzi de preg\u0103tit" }), _jsx("p", { style: { fontSize: "1.5rem", fontWeight: 600 }, children: stats.pendingProcessingCount })] }), _jsxs("div", { className: "card", children: [_jsx("h4", { children: "Comenzi livrate (total)" }), _jsx("p", { style: { fontSize: "1.5rem", fontWeight: 600 }, children: stats.deliveredCount })] }), _jsxs("div", { className: "card", children: [_jsx("h4", { children: "Produse cu stoc redus" }), _jsx("p", { style: { fontSize: "1.5rem", fontWeight: 600 }, children: stats.lowStockCount })] })] })), _jsxs("div", { className: "card", style: { marginBottom: "2rem" }, children: [_jsx("h3", { children: isEditing ? "Editează produs" : "Adaugă produs" }), _jsxs("form", { onSubmit: handleSubmit(onSubmitProduct), children: [_jsxs("label", { children: ["Nume", _jsx("input", { type: "text", ...register("name", { required: true }) })] }), _jsxs("label", { children: ["Descriere", _jsx("textarea", { ...register("description", { required: true }), rows: 3 })] }), _jsxs("label", { children: ["Pre\u021B (RON)", _jsx("input", { type: "number", step: "0.01", ...register("price", { required: true, min: 0, valueAsNumber: true }) })] }), _jsxs("label", { children: ["Stoc", _jsx("input", { type: "number", ...register("stock", { required: true, min: 0, valueAsNumber: true }) })] }), _jsxs("label", { children: ["Categorie", _jsx("input", { type: "text", placeholder: "ex: Electronice", ...register("category") })] }), _jsxs("label", { children: ["Imagine (URL)", _jsx("input", { type: "url", ...register("imageUrl", { required: true }) })] }), _jsxs("div", { style: { marginBottom: "1rem" }, children: [_jsx("p", { style: { marginBottom: "0.5rem", fontWeight: 600 }, children: "sau \u00EEncarc\u0103 o imagine din PC" }), _jsx("label", { htmlFor: "product-image-upload", style: {
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#0d6efd",
                                            color: "#fff",
                                            padding: "0.75rem 1.5rem",
                                            borderRadius: "999px",
                                            cursor: uploadingImage ? "not-allowed" : "pointer",
                                            opacity: uploadingImage ? 0.7 : 1,
                                            fontWeight: 600,
                                        }, children: uploadingImage ? "Se încarcă..." : "Încarcă din calculator" }), _jsx("input", { id: "product-image-upload", type: "file", accept: "image/*", onChange: onImageUpload, disabled: uploadingImage, style: { display: "none" } })] }), imageUrlValue && (_jsxs("div", { style: { marginBottom: "1rem" }, children: [_jsx("small", { children: "Previzualizare:" }), _jsx("div", { children: _jsx("img", { src: resolveImageUrl(imageUrlValue), alt: "previzualizare produs", style: { maxWidth: "200px" } }) })] })), _jsx("button", { className: "primary-btn", type: "submit", disabled: isSubmitting, children: isSubmitting ? "Se salvează..." : isEditing ? "Actualizează produs" : "Creează produs" }), isEditing && (_jsx("button", { className: "secondary-btn", type: "button", onClick: onCancelEdit, style: { marginLeft: "1rem" }, children: "Anuleaz\u0103 editarea" }))] })] }), !loading && (_jsxs("div", { className: "card-grid", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { children: "Produse existente" }), products.length === 0 ? (_jsx("p", { children: "Nu exist\u0103 produse \u00EEn catalog." })) : (_jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0 }, children: products.map((product) => (_jsxs("li", { style: { display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }, children: [_jsxs("span", { children: [product.name, " \u2013 ", product.price.toFixed(2), " RON", product.category ? ` (${product.category})` : ""] }), _jsxs("span", { children: [_jsx("button", { className: "secondary-btn", style: { marginRight: "0.5rem" }, onClick: () => onEditProduct(product), children: "Editeaz\u0103" }), _jsx("button", { className: "secondary-btn", onClick: () => onDeleteProduct(product.id), children: "\u0218terge" })] })] }, product.id))) }))] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Comenzi" }), orders.length === 0 ? (_jsx("p", { children: "Nu exist\u0103 comenzi." })) : (_jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Total" }), _jsx("th", { children: "Status" })] }) }), _jsx("tbody", { children: orders.map((order) => (_jsxs("tr", { children: [_jsxs("td", { children: [order.id.slice(0, 8), "..."] }), _jsxs("td", { children: [order.total.toFixed(2), " RON"] }), _jsx("td", { children: _jsx("select", { value: order.status, onChange: (e) => onStatusChange(order.id, e.target.value), children: STATUSES.map((status) => (_jsx("option", { value: status, children: status }, status))) }) })] }, order.id))) })] }))] })] }))] }));
};
export default AdminDashboardPage;
