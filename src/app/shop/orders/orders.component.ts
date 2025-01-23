import { Component } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  constructor(
    private orderService: OrderService
  ) {
    this.fetchOrders();
  }





  fetchOrders(): void {
    this.orderService.findAll().subscribe({
      next: (orders) => {
        console.log("Returned orders")
        console.log(JSON.stringify(orders))
      },
      error: (error) => {
        console.error("Failed to fetch orders")
        console.error(error)
      }
    })
  }

}
