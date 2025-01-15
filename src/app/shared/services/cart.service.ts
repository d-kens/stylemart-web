import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, throwError } from "rxjs";
import { Product, CartProduct } from "../models/cart.model";

import { environment } from "../../../environments/environment";

const cartBaseUrl = environment.cart.baseUrl

@Injectable({
    providedIn: 'root'
})
export class CartService {
    
    private readonly http = inject(HttpClient);
    private readonly keyStorage = 'cart';

    private readonly addedToCart$ = new BehaviorSubject<CartProduct[]>([]);
    addedToCart = this.addedToCart$.asObservable();

    constructor() {
        const productsInCart = this.getCart();
        this.addedToCart$.next(productsInCart);
    }

    getCart(): CartProduct[] {
        const products = localStorage.getItem(this.keyStorage);
        return products ? JSON.parse(products) as CartProduct[] : []
    }


    saveCart(products: CartProduct[]): void {
        localStorage.setItem(this.keyStorage, JSON.stringify(products));
        this.addedToCart$.next(products);
    }

    updateCart(product: CartProduct, command: 'add' | 'remove'): void {
        const productsInCart = this.getCart();
        const existingProductInCart = productsInCart.find(productInCart => productInCart.id === product.id);

        switch(command) {
            case 'add':
                if (existingProductInCart) {
                    existingProductInCart.quantity++;
                } else {
                    productsInCart.push({
                        id: product.id!,
                        name: product.name,
                        imageUrl: product.imageUrl,
                        price: product.price,
                        quantity: 1,
                    })
                }
                break;

            case 'remove':
                if(existingProductInCart) {
                    if(existingProductInCart.quantity > 1) {
                        existingProductInCart.quantity--;
                    } else {
                        this.removeFromCart(existingProductInCart.id!);
                        return;
                    }
                }
                break;
        }
    }

    removeFromCart(productId: string): void {
        const productsInCart = this.getCart();
        const updatedCart = productsInCart.filter(productInCart => productInCart.id!== productId);
        this.saveCart(updatedCart);
    }

    clearCart() {
        localStorage.removeItem(this.keyStorage);
        this.addedToCart$.next([]);
    }

    syncCarts() {
        this.getCartItemsFromDb().subscribe((dbProducts) => {
            const localProducts = this.getCart();
    
            // Create a map for a quick lookup of local products
            const localProductMap = new Map<string, CartProduct>();
            localProducts.forEach(product => {
                localProductMap.set(product.id, product);
            });
    
            const updatedCart: CartProduct[] = [];
    
            // Handle products in the database
            dbProducts.forEach(dbProduct => {
                if (localProductMap.has(dbProduct.id)) {
                    // If product exists in both, resolve quantity
                    const localProduct = localProductMap.get(dbProduct.id)!;
                    localProduct.quantity = dbProduct.quantity; // TODO: What is the best way to resolve quantity
                    updatedCart.push(localProduct);
                } else {
                    // If product is in the database but not in the local cart, add it to the local cart
                    updatedCart.push({ ...dbProduct });
                }
            });
    
            // Retain products that are in the local cart but not in the database
            localProducts.forEach(localProduct => {
                if (!dbProducts.some(dbProduct => dbProduct.id === localProduct.id)) {
                    updatedCart.push(localProduct);
                }
            });
    
            this.saveCart(updatedCart);
            this.updateCartOnBackend(updatedCart);
        });
    }
    
    private getCartItemsFromDb(): Observable<CartProduct[]> {
        return this.http.get<CartProduct[]>(`${cartBaseUrl}`);
    }
    
    private updateCartOnBackend(updatedCart: CartProduct[]): void {
        this.http.patch(`${cartBaseUrl}`, updatedCart).pipe(
            catchError(error => {
                console.error('Error updating cart on backend:', error);
                return throwError(() => new Error(error));
            })
        ).subscribe(response => {
            console.log('Cart updated successfully on backend:', response);
        });
    }
    
    
}

