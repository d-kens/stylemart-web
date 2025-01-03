/**
 * This class is responsible for managing the shopping cart state in the application.
 * It interacts with the local storage to persist cart items and provides methods to add, remove and clear items in the cart.
 * It uses BehaviourSubject to emit updates to the cart, allowing other parts of the app to react to the changes.
 */

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { Cart, CartItemAdd } from "../models/cart.model";
import { environment } from "../../../environments/environment";


const ordersBaseUrl = environment.orders.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class CartService {
    http = inject(HttpClient);
    private keyStorage = 'cart'

    private addedToCart$ = new BehaviorSubject<Array<CartItemAdd>>([]);
    addedToCart = this.addedToCart$.asObservable();


    constructor() {
        const cartFromLocalStorage = this.getCartFromLocalStorage();
        this.addedToCart$.next(cartFromLocalStorage);
    }


    private getCartFromLocalStorage(): Array<CartItemAdd> {
        const cartProducts = localStorage.getItem(this.keyStorage)

        if (cartProducts) {
                return JSON.parse(cartProducts) as CartItemAdd[]
        } else {
                return [];
        }
    }


    updateCart(productId: string, command: 'add' | 'remove'): void {
        const itemToAdd: CartItemAdd = { productId, quantity: 1}

        const cartFromLocalStorage = this.getCartFromLocalStorage();

        if(cartFromLocalStorage.length !== 0) {
            const existingProduct = cartFromLocalStorage.find(item => item.productId === productId);

            if (existingProduct) {
                if (command === 'add') {
                    existingProduct.quantity++;
                } else if (command === 'remove') {
                    existingProduct.quantity--;
                }
            } else {
                cartFromLocalStorage.push(itemToAdd);
            }
        } else {
            cartFromLocalStorage.push(itemToAdd);
        }
        localStorage.setItem(this.keyStorage, JSON.stringify(cartFromLocalStorage));
        this.addedToCart$.next(cartFromLocalStorage);
    }

    removeFromCart(productId: string) {
        const cartFromLocalStorage = this.getCartFromLocalStorage();

        const existingProduct = cartFromLocalStorage.find(item => item.productId === productId);

        if(existingProduct) {
            cartFromLocalStorage.splice(cartFromLocalStorage.indexOf(existingProduct), 1);
            localStorage.setItem(this.keyStorage, JSON.stringify(cartFromLocalStorage));
            this.addedToCart$.next(cartFromLocalStorage);
        }
    }

    clearCart() {
        localStorage.removeItem(this.keyStorage);
        this.addedToCart$.next([]);
    }

    getCartDetail(): Observable<Cart> {
        const cartFromLocalStorage = this.getCartFromLocalStorage();

        // create a comma separated list of product ids
        const publicIdsForURL = cartFromLocalStorage.reduce(
          (acc, item) => `${acc}${acc.length > 0 ? ',' : ''}${item.productId}`,
          ''
        );

        // get request including the comma separated list of prodcut ids as a query param
        return this.http
          .get<Cart>(`${ordersBaseUrl}/cart-details`, {
            params: { productIds: publicIdsForURL },
          })
          .pipe(
            tap((cart) => console.log('Cart from API:', cart)),
            map((cart) => this.mapQuantity(cart, cartFromLocalStorage))
          );
    }


    /**
     * 
     * @param cart 
     * @param cartFromLocalStorage 
     * @returns cart: Cart
     * 
     * Ensuring the quatities in the API response match those in the local storage
         - Iterate over local items
         - Find the corresponding product in the API response
         - Update the quantity in the API response with the local quantity
         - Return the updated cart
     */
    private mapQuantity(
        cart: Cart,
        cartFromLocalStorage: Array<CartItemAdd>
      ): Cart {
        for (const cartItem of cartFromLocalStorage) {
          const foundProduct = cart.products.find(
            (item) => item.productId === cartItem.productId
          );
          if (foundProduct) {
            foundProduct.quantity = cartItem.quantity;
          }
        }
        return cart;
    }


    initPayment(cart: Array<CartItemAdd>){
        console.log(cart);
        // make a post request with the cart data
    }




}