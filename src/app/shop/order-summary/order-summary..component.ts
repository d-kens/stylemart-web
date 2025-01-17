import { Component } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-order-summary',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummary {

  cartItems: any[] = [];
  cartTotal: number = 0;
  loading = false;


  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastrService,
    private router: Router
  ) {
    this.loadCartProducts();
  }


  loadCartProducts(): void {
    this.loading = true;
    this.cartItems = this.cartService.getCart();
    this.cartTotal = this.cartService.computeTotal();
    this.loading = false;
  }
  

  placeOrder() {
    
    this.orderService.placeOrder().subscribe({
      next: (order) => {
        console.log("Returned order")
        this.toastService.success("Order placed successfully!");
        this.router.navigate(['/orders']);
        console.log(JSON.stringify(order))
      },
      error: (error) => {
        this.toastService.error('Failed to place order');
      }
    })
  }
}
