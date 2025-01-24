import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Order } from "../models/order.model";

const ordersBaseUrl = environment.orders.baseUrl

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private readonly http = inject(HttpClient);


    findAll(): Observable<Order[]> {
        return this.http.get<Order[]>(`${ordersBaseUrl}`);
    }

    findOne(orderId: string): Observable<Order> {
        return this.http.get<Order>(`${ordersBaseUrl}/${orderId}`);
    }

    placeOrder(): Observable<Order> {
        return this.http.post<Order>(`${ordersBaseUrl}`, '');
    }

}