import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Cart, CartItem, CartItemAdd } from '../../shared/models/cart.model';
import { AuthService } from '../../auth/data-access/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  router = inject(Router);

  cart: Array<CartItem> = [];
  labelCheckout = 'Login to checkout';
  action: 'login' | 'checkout' = 'login';
  loading = false;


  constructor() {
    this.getCartDetails();
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

  private getCartDetails() {
    this.loading = true;

    this.cartService.getCartDetail().subscribe({
      next: (cart: Cart) => {
        this.cart = cart.products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching cart details:', error);
        this.loading = false;
      },
    })
  }

  private updateQuantity(cartUpdated: Array<CartItemAdd>) {
    for (const cartItemToUpdate of this.cart) {
      const itemToUpdate = cartUpdated.find(
        (item) => item.productId === cartItemToUpdate.productId
      );
      if (itemToUpdate) {
        cartItemToUpdate.quantity = itemToUpdate.quantity;
      } else {
        this.cart.splice(this.cart.indexOf(cartItemToUpdate), 1);
      }
    }
  }

  addQuantityToCart(productId: string) {
    this.cartService.updateCart(productId, 'add');
  }

  removeQuantityToCart(productId: string, quantity: number) {
    if (quantity > 1) {
      this.cartService.updateCart(productId, 'remove');
    }
  }

  removeItem(productId: string) {
    const itemToRemoveIndex = this.cart.findIndex(
      (item) => item.productId === productId
    );
    if (itemToRemoveIndex) {
      this.cart.splice(itemToRemoveIndex, 1);
    }
    this.cartService.removeFromCart(productId);
  }

  computeTotal() {
    return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  checkout() {
    if (this.action === 'login') {
      this.router.navigate(['auth/sign-in']);
    } else if (this.action === 'checkout') {
      const cartItemsAdd = this.cart.map(
        (item) =>
          ({ productId: item.productId, quantity: item.quantity } as CartItemAdd)
      );

      this.cartService.initPayment(cartItemsAdd)
    }
  }

}
