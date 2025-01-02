export interface CartItemAdd {
    productId: string;
    quantity: number;
}

export interface Cart {
    products: CartItem[];
}

export interface CartItem {
    productName: string;
    price: number;
    brand: string;
    imageUrl: string;
    quantity: number;
    productId: string;
}