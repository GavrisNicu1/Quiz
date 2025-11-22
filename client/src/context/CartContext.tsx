import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { CartItem } from "../types";
import { fetchCart } from "../api/cart";
import { useAuth } from "../hooks/useAuth";

export interface CartContextValue {
  items: CartItem[];
  count: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  resetCart: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
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
    } catch (error) {
      console.error("Failed to load cart", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const resetCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count,
      loading,
      refreshCart,
      setItems,
      resetCart,
    }),
    [count, items, loading, refreshCart, resetCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
