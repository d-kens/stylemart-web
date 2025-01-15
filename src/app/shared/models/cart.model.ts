export type ProductSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export interface ProductCategory {
    id?: string,
    name?: string;
}

export interface BaseProduct {
    brand: string;
    color: string;
    size: ProductSizes;
    stock: number;
    name: string;
    price: number;
    description: string;
}

export interface Product extends BaseProduct {
    id?: string;
    category: ProductCategory;
    imageUrl: string;
}


export interface CartProduct {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
}

