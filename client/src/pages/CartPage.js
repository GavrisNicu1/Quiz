import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { updateCartItem, removeCartItem, clearCart } from "../api/cart";
import { checkoutOrder } from "../api/orders";
import { useCart } from "../hooks/useCart";
const CartPage = () => {
    const { items, setItems, loading, refreshCart } = useCart();
    const [error, setError] = useState(null);
    const [shippingAddress, setShippingAddress] = useState("Strada Exemplu 10, București");
    const [checkoutMessage, setCheckoutMessage] = useState(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    useEffect(() => {
        setError(null);
        void refreshCart().catch((err) => {
            setError(err instanceof Error ? err.message : "Nu pot încărca coșul");
        });
    }, [refreshCart]);
    const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);
    const handleQuantityChange = async (itemId, quantity) => {
        if (quantity < 1)
            return;
        try {
            const updated = await updateCartItem(itemId, { quantity });
            setItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu pot actualiza cantitatea");
        }
    };
    const handleRemove = async (itemId) => {
        try {
            await removeCartItem(itemId);
            setItems((prev) => prev.filter((item) => item.id !== itemId));
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu pot elimina produsul");
        }
    };
    const handleCheckout = async () => {
        if (!shippingAddress.trim()) {
            setError("Completează adresa de livrare");
            return;
        }
        try {
            setIsCheckingOut(true);
            setCheckoutMessage(null);
            await checkoutOrder({ shippingAddress });
            setCheckoutMessage("Comanda a fost trimisă!");
            await refreshCart();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu pot finaliza comanda");
        }
        finally {
            setIsCheckingOut(false);
        }
    };
    const handleClear = async () => {
        try {
            await clearCart();
            setItems([]);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Nu pot goli coșul");
        }
    };
    return (_jsxs("section", { children: [_jsxs("header", { children: [_jsx("h1", { children: "Co\u0219ul meu" }), _jsx("p", { children: "Revizuie\u0219te produsele \u00EEnainte de a finaliza comanda." })] }), loading && _jsx("p", { children: "Se \u00EEncarc\u0103 co\u0219ul..." }), error && _jsx("div", { className: "alert", children: error }), !loading && items.length === 0 && _jsx("p", { children: "Nu ai produse \u00EEn co\u0219 momentan." }), !loading && items.length > 0 && (_jsxs("div", { className: "card", children: [_jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Produs" }), _jsx("th", { children: "Cantitate" }), _jsx("th", { children: "Pret" }), _jsx("th", {})] }) }), _jsx("tbody", { children: items.map((item) => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("strong", { children: item.product.name }), _jsx("div", { children: item.product.description })] }), _jsx("td", { children: _jsx("input", { type: "number", min: 1, value: item.quantity, onChange: (e) => handleQuantityChange(item.id, Number(e.target.value)) }) }), _jsxs("td", { children: [(item.product.price * item.quantity).toFixed(2), " RON"] }), _jsx("td", { children: _jsx("button", { className: "secondary-btn", onClick: () => handleRemove(item.id), children: "\u0218terge" }) })] }, item.id))) })] }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [_jsxs("label", { children: ["Adres\u0103 livrare", _jsx("input", { type: "text", value: shippingAddress, onChange: (e) => setShippingAddress(e.target.value) })] }), _jsx("p", { children: _jsxs("strong", { children: ["Total: ", subtotal.toFixed(2), " RON"] }) }), _jsxs("div", { style: { display: "flex", gap: "1rem" }, children: [_jsx("button", { className: "primary-btn", onClick: handleCheckout, disabled: isCheckingOut, children: isCheckingOut ? "Se procesează..." : "Finalizează comanda" }), _jsx("button", { className: "secondary-btn", onClick: handleClear, children: "Gole\u0219te co\u0219ul" })] }), checkoutMessage && _jsx("div", { className: "success", children: checkoutMessage })] })] }))] }));
};
export default CartPage;
