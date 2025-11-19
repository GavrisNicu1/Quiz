import type { Product } from "../types";
export declare const listProducts: () => Promise<{
    price: number;
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    stock: number;
    createdAt: string;
    updatedAt?: string;
}[]>;
export declare const createProduct: (product: Partial<Product>) => Promise<{
    price: number;
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    stock: number;
    createdAt: string;
    updatedAt?: string;
}>;
export declare const updateProduct: (id: string, product: Partial<Product>) => Promise<{
    price: number;
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    stock: number;
    createdAt: string;
    updatedAt?: string;
}>;
export declare const deleteProduct: (id: string) => Promise<void>;
