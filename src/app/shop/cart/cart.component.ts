import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../auth/data-access/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Cart, CartItem, Product } from '../../shared/models/cart.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  toastService = inject(ToastrService)
  router = inject(Router);

  cartItems: CartItem[] = []

  labelCheckout = 'Login to checkout';
  action: 'login' | 'checkout' = 'login';
  loading = false;


  constructor() {
    this.getCart();
  }


  ngOnInit(): void {
    this.cartService.addedToCart.subscribe((cart) => this.updateQuantity(cart));

    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.updateCheckoutLabel(isAuthenticated);
    });
  }

  private updateCheckoutLabel(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      this.labelCheckout = 'Checkout';
      this.action = 'checkout';
    } else {
      this.labelCheckout = 'Login to checkout';
      this.action = 'login';
    }
  }

  private getCart() {
    this.loading = true;

    const cart: Cart = this.cartService.getCart()

    this.cartItems = cart.items;

    this.loading = false;
  }

  private updateQuantity(cartUpdated: Array<CartItem>) {
    for (const cartItemToUpdate of this.cartItems) {
      const itemToUpdate = cartUpdated.find(
        (item) => item.productId === cartItemToUpdate.productId
      );
      if (itemToUpdate) {
        cartItemToUpdate.quantity = itemToUpdate.quantity;
      } else {
        this.cartItems.splice(this.cartItems.indexOf(cartItemToUpdate), 1);
      }
    }
  }

  addQuantityToCart(cartItem: CartItem) {
    this.cartService.updateCart(cartItem,'add');
  }

  removeQuantityToCart(cartItem: CartItem) {
    this.cartService.updateCart(cartItem, 'remove');
  }

  removeItem(itemId: string) {
    const itemToRemoveIndex = this.cartItems.findIndex(
      (item) => item.productId === itemId
    );

    if (itemToRemoveIndex) {
      this.cartItems.splice(itemToRemoveIndex, 1);
    }
    this.cartService.removeFromCart(itemId);
  }

  computeTotal() {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  checkout() {
    if (this.action === 'login') {
      this.router.navigate(['auth/sign-in']);
    } else if (this.action === 'checkout') {
      this.toastService.show("Checking out...");
    }
  }

}
