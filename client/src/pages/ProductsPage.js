import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { listProducts } from "../api/products";
import { addCartItem } from "../api/cart";
import { useAuth } from "../hooks/useAuth";
const currency = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
});
const ProductsPage = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingProductId, setAddingProductId] = useState(null);
    useEffect(() => {
        const load = async () => {
            setError(null);
            try {
                const response = await listProducts();
                setProducts(response);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Nu pot încărca produsele");
            }
            finally {
                setLoading(false);
            }
        };
        void load();
    }, []);
    const handleAddToCart = async (productId) => {
        if (!user) {
            setError("Trebuie să fii autentificat pentru a adăuga în coș");
            return;
        }
        try {
            setAddingProductId(productId);
            await addCartItem({ productId, quantity: 1 });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut adăuga produsul");
        }
        finally {
            setAddingProductId(null);
        }
    };
    const content = useMemo(() => {
        if (loading) {
            return _jsx("p", { children: "Se \u00EEncarc\u0103 lista de produse..." });
        }
        if (error) {
            return _jsx("div", { className: "alert", children: error });
        }
        if (products.length === 0) {
            return _jsx("p", { children: "Nu exist\u0103 produse \u00EEn catalog \u00EEn acest moment." });
        }
        return (_jsx("div", { className: "card-grid", children: products.map((product) => (_jsxs("article", { className: "card", children: [_jsx("h3", { children: product.name }), _jsx("p", { children: product.description }), _jsx("p", { children: _jsx("strong", { children: currency.format(product.price) }) }), _jsx("button", { onClick: () => handleAddToCart(product.id), disabled: !user || addingProductId === product.id, children: !user ? "Autentifică-te" : addingProductId === product.id ? "Se adaugă..." : "Adaugă în coș" })] }, product.id))) }));
    }, [addingProductId, error, loading, products, user]);
    return (_jsxs("section", { children: [_jsxs("header", { children: [_jsx("h1", { children: "Produsele disponibile" }), _jsx("p", { children: "Adaug\u0103 rapid \u00EEn co\u0219 orice produs din catalog." })] }), content] }));
};
export default ProductsPage;
