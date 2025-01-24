
export interface Order {
    id: string;
    orderStatus: string;
    total: number;
    createdAt: string;
    updatedAt: string;
    orderItems?: OrderItem[]
}

export interface OrderItem {
    id: string;
    name: string;
    price: string;
    quantity: number;
}