import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

const ordersBaseUrl = environment.orders.baseUrl

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private readonly http = inject(HttpClient);


    placeOrder(): Observable<any> {
        return this.http.post<any>(`${ordersBaseUrl}`, '');
    }

}