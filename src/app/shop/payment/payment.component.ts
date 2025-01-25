import { Component } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {

  phoneNumber: string = '';
  orderId: string;
  paymentResponse: any;
  isPolling: boolean = false;
  pollingStatus: string = '';
  pollingComplete: boolean = false;


  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.orderId = this.route.snapshot.paramMap.get('orderId')!;

    console.log(this.orderId)
  }

  initiatePayment() {}

  processPayment() {}

  startPolling() {}

  checkOrderStatus() {}

  confirmPayment() {}
}
