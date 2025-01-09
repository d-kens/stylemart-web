import { Component, inject } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-review-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './review-cart.component.html',
  styleUrl: './review-cart.component.scss'
})
export class ReviewCartComponent {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  toastService = inject(ToastrService);



  cartItems: any[] = []; // Initialize with an empty array
  cartTotal: number = 0; // Initialize with 0
  loading = false;
  

  placeOrder() {
    
    this.orderService.placeOrder().subscribe({
      next: (order) => {
        console.log("Returned order")
        this.toastService.success("Order placed successfully!");
        
      },
      error: (error) => {
        this.toastService.error('Failed to place order');
      }
    })
  }
}
