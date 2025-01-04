import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Cart, CartItem } from "../models/cart.model";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    http = inject(HttpClient);
    private keyStorage = 'cart';

    private addedToCart$ = new BehaviorSubject<CartItem[]>([]);
    addedToCart = this.addedToCart$.asObservable();

    constructor() {
        const cartFromLocalStorage = this.getCartFromLocalStorage();
        this.addedToCart$.next(cartFromLocalStorage);
    }

    private getCartFromLocalStorage(): CartItem[] {
        const cartItems = localStorage.getItem(this.keyStorage);
        return cartItems ? JSON.parse(cartItems) as CartItem[] : [];
    }

    updateCart(cartItem: CartItem, command: 'add' | 'remove'): void {
        const itemToAdd: CartItem = {
            id: cartItem.id,
            name: cartItem.name,
            price: cartItem.price,
            brand: cartItem.brand,
            imageUrl: cartItem.imageUrl,
            quantity: 1,
        };

        const cartFromLocalStorage = this.getCartFromLocalStorage();
        const exitingCartItem = cartFromLocalStorage.find(item => item.id === itemToAdd.id)

        if (exitingCartItem) {
            if (command === 'add') {
                exitingCartItem.quantity++;
            } else if (command === 'remove' && exitingCartItem.quantity > 1) {
                exitingCartItem.quantity--;
            } else if (command === 'remove') {
                this.removeFromCart(exitingCartItem.id);
                return;
            }
        } else if (command === 'add') {
            cartFromLocalStorage.push(itemToAdd);
        }

        localStorage.setItem(this.keyStorage, JSON.stringify(cartFromLocalStorage));
        this.addedToCart$.next(cartFromLocalStorage);
    }

    removeFromCart(id: string): void {
        const cartFromLocalStorage = this.getCartFromLocalStorage();
        const existingProductIndex = cartFromLocalStorage.findIndex(item => item.id === id);

        if (existingProductIndex !== -1) {
            cartFromLocalStorage.splice(existingProductIndex, 1);
            localStorage.setItem(this.keyStorage, JSON.stringify(cartFromLocalStorage));
            this.addedToCart$.next(cartFromLocalStorage);
        }
    }

    clearCart(): void {
        localStorage.removeItem(this.keyStorage);
        this.addedToCart$.next([]);
    }

    getCart(): Cart {
        const cartFromLocalStorage = this.getCartFromLocalStorage();
        const cart: Cart = {
            items: cartFromLocalStorage
        };
        return cart;
    }
    
}
