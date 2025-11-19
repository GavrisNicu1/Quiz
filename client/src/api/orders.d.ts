export declare const fetchOrders: () => Promise<{
    total: number;
    items: {
        price: number;
        id: string;
        productId: string;
        quantity: number;
        name: string;
    }[];
    id: string;
    status: string;
    userId: string;
    createdAt: string;
}[]>;
export declare const checkoutOrder: (payload: {
    shippingAddress: string;
}) => Promise<{
    total: number;
    items: {
        price: number;
        id: string;
        productId: string;
        quantity: number;
        name: string;
    }[];
    id: string;
    status: string;
    userId: string;
    createdAt: string;
}>;
export declare const updateOrderStatus: (id: string, status: string) => Promise<{
    total: number;
    items: {
        price: number;
        id: string;
        productId: string;
        quantity: number;
        name: string;
    }[];
    id: string;
    status: string;
    userId: string;
    createdAt: string;
}>;
