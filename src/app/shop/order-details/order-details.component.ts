import { Component } from '@angular/core';
import { Order } from '../../shared/models/order.model';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {
  order!: Order;
  orderItems: any[] = [];
  loading: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (orderId) {
      this.fetchOrderDetails(orderId);
    }
  }


  fetchOrderDetails(orderId: string): void {
    this.loading = true;

    this.orderService.findOne(orderId).subscribe({
      next: (order) => {
        this.order = order;
        console.log(order)
        // this.orderItems = order.;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Could not fetch order details: ' + error);
      },
    });
  }

  onPay(orderId: string): void {
    this.toastr.success(`Payment initiated for Order #${orderId}`);
  }

}
