import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { fetchCart } from "../api/cart";
import { useAuth } from "../hooks/useAuth";
export const CartContext = createContext(undefined);
export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const refreshCart = useCallback(async () => {
        if (!user) {
            setItems([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await fetchCart();
            setItems(data);
        }
        catch (error) {
            console.error("Failed to load cart", error);
        }
        finally {
            setLoading(false);
        }
    }, [user]);
    useEffect(() => {
        void refreshCart();
    }, [refreshCart]);
    const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
    const resetCart = useCallback(() => setItems([]), []);
    const value = useMemo(() => ({
        items,
        count,
        loading,
        refreshCart,
        setItems,
        resetCart,
    }), [count, items, loading, refreshCart, resetCart]);
    return _jsx(CartContext.Provider, { value: value, children: children });
};
