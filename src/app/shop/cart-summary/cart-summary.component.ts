import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';
import { CartProduct } from '../../shared/models/cart.model';

@Component({
  selector: 'app-cart-summary',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummary implements OnInit {

  productsInCart: CartProduct[] = [];
  loading = false;
  errorMessage = '';


  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastrService,
    private router: Router
  ) {
    this.loadCartProducts();
  }

  ngOnInit(): void {
    this.cartService.addedToCart.subscribe((productsInCart) => this.updateQuantity(productsInCart));
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


  loadCartProducts(): void {
    this.loading = true;
    this.productsInCart = this.cartService.getCart();
    this.loading = false;
  }

  addQuantityToCart(product: CartProduct) {
    this.cartService.updateCart(product, 'add');
  }

  
  removeQuantityToCart(product: CartProduct) {
    this.cartService.updateCart(product, 'remove');
  }

  computeTotal() {
    return this.productsInCart.reduce((acc, product) => acc + product.price * product.quantity, 0);
  }


  // TODO: Fix sync cart when placing order
  placeOrder() {
    this.orderService.placeOrder().subscribe({
      next: (order) => {
        this.cartService.syncCarts();
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
        this.toastService.success("Order placed successfully!");
      },
      error: (error) => {
        this.errorMessage = error.error.message;
        console.log(error);
        this.toastService.error(this.errorMessage);
      }
    });
  }
}
