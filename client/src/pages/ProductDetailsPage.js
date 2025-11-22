import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api/products";
import { addCartItem } from "../api/cart";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { resolveImageUrl } from "../utils/image";
const currency = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
});
const ProductDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { refreshCart } = useCart();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);
    useEffect(() => {
        if (!id) {
            setError("Produsul nu există");
            setLoading(false);
            return;
        }
        const load = async () => {
            setError(null);
            try {
                const response = await getProduct(id);
                setProduct(response);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Nu pot încărca produsul");
            }
            finally {
                setLoading(false);
            }
        };
        void load();
    }, [id]);
    const handleAddToCart = async () => {
        if (!user) {
            setError("Trebuie să fii autentificat pentru a adăuga produsul în coș");
            navigate("/login");
            return;
        }
        if (!product) {
            return;
        }
        try {
            setAdding(true);
            await addCartItem({ productId: product.id, quantity: 1 });
            await refreshCart();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu se poate adăuga produsul în coș");
        }
        finally {
            setAdding(false);
        }
    };
    if (loading) {
        return _jsx("p", { children: "Se \u00EEncarc\u0103 detaliile..." });
    }
    if (error) {
        return (_jsxs("section", { children: [_jsx("p", { className: "alert", children: error }), _jsx(Link, { to: "/", className: "secondary-btn", children: "\u00CEnapoi la produse" })] }));
    }
    if (!product) {
        return (_jsxs("section", { children: [_jsx("p", { children: "Produsul nu a fost g\u0103sit." }), _jsx(Link, { to: "/", className: "secondary-btn", children: "\u00CEnapoi la produse" })] }));
    }
    return (_jsxs("section", { children: [_jsxs("header", { style: { marginBottom: "1.5rem" }, children: [_jsx(Link, { to: "/", className: "secondary-btn", style: { marginBottom: "1rem", display: "inline-block" }, children: "\u2190 \u00CEnapoi la produse" }), _jsx("h1", { children: product.name }), _jsx("p", { children: product.category })] }), _jsxs("div", { className: "product-details", children: [_jsx("div", { className: "product-details__image", children: _jsx("img", { src: resolveImageUrl(product.imageUrl), alt: product.name }) }), _jsxs("div", { className: "product-details__info", children: [_jsx("p", { children: product.description }), _jsx("p", { style: { fontSize: "1.5rem", fontWeight: 600 }, children: currency.format(product.price) }), _jsxs("p", { children: ["Stoc disponibil: ", product.stock] }), _jsx("button", { className: "primary-btn", onClick: handleAddToCart, disabled: adding, children: adding ? "Se adaugă..." : "Adaugă în coș" })] })] })] }));
};
export default ProductDetailsPage;
