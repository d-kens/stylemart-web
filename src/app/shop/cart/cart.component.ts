import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../auth/data-access/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartProduct } from '../../shared/models/cart.model';

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


  productsInCart: CartProduct[] = []
  labelCheckout = 'Login to checkout';
  action: 'login' | 'checkout' = 'login';
  loading = false;


  constructor() {
    this.getCart();
  }

  ngOnInit(): void {
    this.cartService.addedToCart.subscribe((productsInCart) => this.updateQuantity(productsInCart));

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
    this.productsInCart = this.cartService.getCart();
    this.loading = false;

  }

  private updateQuantity(updateCartProducts: CartProduct[]) {
    for (const product of this.productsInCart) {
      const productToUpdate = updateCartProducts.find(
        (updatedCartProduct) => updatedCartProduct.id === product.id
      )

      if(productToUpdate) {
        product.quantity = productToUpdate.quantity;
      } else {
        this.productsInCart.splice(this.productsInCart.indexOf(product), 1)
      }
    }
  } 
  


  addQuantityToCart(product: CartProduct) {
    this.cartService.updateCart(product, 'add');
  }

  removeQuantityToCart(product: CartProduct) {
    this.cartService.updateCart(product, 'remove');
  }

  removeItem(productId: string) {
    const productToRemoveIndex = this.productsInCart.findIndex(
      (product) => product.id === productId
    );

    if (productToRemoveIndex) {
      this.productsInCart.splice(productToRemoveIndex, 1);
    }

    this.cartService.removeFromCart(productId);
  }




  computeTotal() {
    return this.productsInCart.reduce((acc, product) => acc + product.price * product.quantity, 0);
  }

  checkout() {
    if (this.action === 'login') {
      this.router.navigate(['auth/sign-in']);
    } else if (this.action === 'checkout') {
      this.cartService.syncCarts();
      this.router.navigate(['order-summary']);
    }
  }

}

