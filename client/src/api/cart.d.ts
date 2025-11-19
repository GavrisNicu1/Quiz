export declare const fetchCart: () => Promise<{
    product: {
        price: number;
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        stock: number;
        createdAt: string;
        updatedAt?: string;
    };
    id: string;
    productId: string;
    quantity: number;
}[]>;
export declare const addCartItem: (payload: {
    productId: string;
    quantity: number;
}) => Promise<{
    product: {
        price: number;
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        stock: number;
        createdAt: string;
        updatedAt?: string;
    };
    id: string;
    productId: string;
    quantity: number;
}>;
export declare const updateCartItem: (id: string, payload: {
    quantity: number;
}) => Promise<{
    product: {
        price: number;
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        stock: number;
        createdAt: string;
        updatedAt?: string;
    };
    id: string;
    productId: string;
    quantity: number;
}>;
export declare const removeCartItem: (id: string) => Promise<void>;
export declare const clearCart: () => Promise<void>;
