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

    updateCart(product: Product, command: 'add' | 'remove'): void {
        const productsInCart = this.getCart();
        const existingProductInCart = productsInCart.find(productInCart => productInCart.id === product.id);

        switch(command) {
            case 'add':
                if (existingProductInCart) {
                    existingProductInCart.quantity++;
                } else {
                    productsInCart.push({...product, quantity: 1 });
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
    
}
