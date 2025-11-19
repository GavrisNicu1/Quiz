export type Role = "USER" | "ADMIN";
export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    createdAt: string;
    updatedAt?: string;
}
export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: Product;
}
export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    name: string;
    price: number;
}
export interface Order {
    id: string;
    status: string;
    total: number;
    userId: string;
    createdAt: string;
    items: OrderItem[];
}
export interface AuthResponse {
    user: User;
    token: string;
}
