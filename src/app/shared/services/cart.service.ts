import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import { Cart, CartItem } from "../models/cart.model";
import { environment } from "../../../environments/environment";

const cartBaseUrl = environment.cart.baseUrl

@Injectable({
    providedIn: 'root'
})
export class CartService {
    
    private readonly http = inject(HttpClient);
    private readonly keyStorage = 'cart';

    private readonly addedToCart$ = new BehaviorSubject<CartItem[]>([]);
    addedToCart = this.addedToCart$.asObservable();

    constructor() {
        const cartFromLocalStorage = this.getCartFromLocalStorage();
        this.addedToCart$.next(cartFromLocalStorage);
    }

    private getCartFromLocalStorage(): CartItem[] {
        const cartItems = localStorage.getItem(this.keyStorage);
        return cartItems ? JSON.parse(cartItems) as CartItem[] : [];
    }

    private saveCartToLocalStorage(cartItems: CartItem[]): void {
        localStorage.setItem(this.keyStorage, JSON.stringify(cartItems));
        this.addedToCart$.next(cartItems);
    }

    updateCart(cartItem: CartItem, command: 'add' | 'remove'): void {
        const cartFromLocalStorage = this.getCartFromLocalStorage();
        const existingItem = cartFromLocalStorage.find(item => item.productId === cartItem.productId);

        switch (command) {
        case 'add':
            if (existingItem) {
            existingItem.quantity++;
            } else {
            cartFromLocalStorage.push({ ...cartItem, quantity: 1 });
            }
            break;
        case 'remove':
            if (existingItem) {
            if (existingItem.quantity > 1) {
                existingItem.quantity--;
            } else {
                this.removeFromCart(existingItem.productId);
                return;
            }
            }
            break;
        }

        this.saveCartToLocalStorage(cartFromLocalStorage);
    }

    removeFromCart(productId: string): void {
        const cartFromLocalStorage = this.getCartFromLocalStorage();
        const updatedCart = cartFromLocalStorage.filter(item => item.productId !== productId);
        this.saveCartToLocalStorage(updatedCart);
    }

    clearCart(): void {
        localStorage.removeItem(this.keyStorage);
        this.addedToCart$.next([]);
    }

    getCart(): Cart {
        const items = this.getCartFromLocalStorage();
        return { items };
    }

    private getCartFromDb(): Observable<Cart> {
        console.log("RETRIEVING CART FROM DB")

        return this.http.get<Cart>(`${cartBaseUrl}`).pipe(
          catchError(err => {
            console.error('Error fetching cart from DB:', err);
            return throwError(() => new Error('Failed to fetch cart from DB.'));
          })
        );
    }

    mergeCarts(): Observable<Cart> {
        const localCart = this.getCartFromLocalStorage();
    
        return this.getCartFromDb().pipe(
            map(dbCart => {
                console.log("DB Items: " + dbCart)
                const mergedItems: CartItem[] = [...dbCart.items];
    
                localCart.forEach(localItem => {
                    const dbItem = mergedItems.find(item => item.productId === localItem.productId);
                    if (dbItem) {
                        dbItem.quantity += localItem.quantity;
                    } else {
                        mergedItems.push(localItem);
                    }
                });
    
                return { items: mergedItems };
            }),
            tap(mergedCart => {
                this.saveCartToLocalStorage(mergedCart.items);
    
    
                this.syncCartToDb(mergedCart.items).subscribe({
                    error: err => console.error('Failed to sync merged cart to DB:', err)
                });
            }),
            catchError(err => {
                console.error('Error merging carts:', err);
                return throwError(() => new Error('Failed to merge carts.'));
            })
        );
    }

  
    private syncCartToDb(cart: CartItem[]): Observable<void> {
        const updateCartDto = { items: cart.map(({ productId, quantity }) => ({ productId, quantity })) };

        console.log("UPDATE CART OBJECT" + updateCartDto.items)
    
        return this.http.patch<void>(`${cartBaseUrl}`, updateCartDto).pipe(
            catchError(err => {
                console.error('Error syncing cart to DB:', err);
                return throwError(() => new Error('Failed to sync cart to DB.'));
            })
        );
    }


    
}
