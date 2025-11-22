import type { ReactNode } from "react";
import type { CartItem } from "../types";
export interface CartContextValue {
    items: CartItem[];
    count: number;
    loading: boolean;
    refreshCart: () => Promise<void>;
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    resetCart: () => void;
}
export declare const CartContext: import("react").Context<CartContextValue>;
export declare const CartProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
