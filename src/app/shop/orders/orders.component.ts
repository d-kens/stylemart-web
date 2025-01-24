import { Component } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { Order } from '../../shared/models/order.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  orders: Order[] = [];
  loading: boolean = false;

  constructor(private orderService: OrderService, private toastr: ToastrService, private router: Router) {
    this.fetchOrders();
  }



  fetchOrders(): void {

    this.loading = true;

    this.orderService.findAll().subscribe({
      next: (orders: Order[]) => {
       console.log(orders)
       this.orders = orders;
       this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error("Could not fetch your orders: " + error)
      }
    })
  }

  onPay(orderId: string): void {
    this.toastr.success(`Payment initiated for Order #${orderId}!`);
  }

  onView(orderId: string): void {
    this.router.navigate([`/orders/${orderId}`]);
  }

}
