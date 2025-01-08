import { Component, inject } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Cart, CartItem } from '../../shared/models/cart.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-review-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './review-cart.component.html',
  styleUrl: './review-cart.component.scss'
})
export class ReviewCartComponent {
  cartService = inject(CartService);
  toastService = inject(ToastrService);


  cartItems: CartItem[] = []; // Initialize with an empty array
  cartTotal: number = 0; // Initialize with 0
  loading = false;
  

  constructor() { 
    this.getCartFromDb();
  }

  getCartFromDb() {
    this.loading = true;
    this.cartService.getCartFromDb().subscribe({
      next: (cart: Cart) => {
        this.cartItems = cart.items || []; // Ensure it's an array
        this.cartTotal = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        this.loading = false;
      },
      error: (error) => {
        this.toastService.error('Failed to fetch cart from database');
        this.loading = false;
      }
    });
  }

  placeOrder() {
    this.toastService.info("Placing order.....");
  }
}
