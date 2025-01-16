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

        this.saveCart(productsInCart)
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

        this.getCartItemsFromDb().subscribe({
            next: (dbProducts) => {
                dbProducts.forEach(dbProduct => {
                    console.log(JSON.stringify(dbProduct));
                });
    
                const localProducts = this.getCart();
        
                const localProductMap = new Map<string, CartProduct>();
                localProducts.forEach(product => {
                    localProductMap.set(product.id, product);
                });
        
                const updatedCart: CartProduct[] = [];
        
                dbProducts.forEach(dbProduct => {
                    if (localProductMap.has(dbProduct.id)) {
                        const localProduct = localProductMap.get(dbProduct.id)!;
                        localProduct.quantity = localProduct.quantity; 
                        updatedCart.push(localProduct);
                    } else {
                        updatedCart.push({ ...dbProduct });
                    }
                });
        
                localProducts.forEach(localProduct => {
                    if (!dbProducts.some(dbProduct => dbProduct.id === localProduct.id)) {
                        updatedCart.push(localProduct);
                    }
                });
        
                this.saveCart(updatedCart);
                this.updateCartOnBackend(updatedCart);
            },
            error: (error) => {
                console.log("An error occurred while fetching");
                console.log(error)
            }
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

