import { Component } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../shared/services/payment.servce';
import { PaymentRequest } from '../../shared/models/payment';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  phoneNumber: string = '';
  order!: Order;
  loading = false;
  


  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private paymentService: PaymentService
  ) {
    const orderid = this.route.snapshot.paramMap.get('orderId')!;
    this.fetchOrderDetails(orderid)
  }


  fetchOrderDetails(orderId: string): void {
    this.loading = true;

    this.orderService.findOne(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Could not fetch order details: ' + error);
      },
    });
  }

  initiatePayment() {

    const paymentReq: PaymentRequest = {
      orderId: this.order.id,
      amount: Number(this.order.total),
      provider: "MPESA",
      mobile: {
        transactionType: "STK",
        phoneNumber: "254707127309"
      }
    }


    console.log("Payment Request");
    console.log(paymentReq);

    this.loading = true;


    this.paymentService.initiatePayment(paymentReq).subscribe({
      next: (paymentResp) => {
        this.loading = false;
        console.log("Initiate Payment response");
        console.log(paymentResp);

      },
      error: (error) => {
        this.loading = false;
        console.log("Pay,mnet Initiation Error: ");
        console.log(error);
        this.toastr.error("Payment initiation Failed", error.message)
      }
    })

  }

}
