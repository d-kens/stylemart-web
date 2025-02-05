import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { PaymentRequest } from "../models/payment";

const paymentBaseUrl = environment.payment.baseurl

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private readonly http = inject(HttpClient);


    initiatePayment(paymentRqst: PaymentRequest): Observable<any> {
        return this.http.post<any>(`${paymentBaseUrl}/initiate-payment`, '');
    }

}