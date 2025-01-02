import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Product, ProductPagination } from "../../admin/data-access/models/product.model";


const productBaseUrl = environment.products.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class ProducService {


    http = inject(HttpClient);


    findAllProducts(page: number = 1, limit: number = 10): Observable<ProductPagination> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('limit', limit.toString());
    
        return this.http.get<ProductPagination>(`${productBaseUrl}`, { params });
    }

    findProudctById(productId: string): Observable<Product> {
        return this.http.get<Product>(`${productBaseUrl}/${productId}`);
    }

    findRelatedProducts(productId:string, page: number = 1, limit: number = 6): Observable<ProductPagination> {
        const params = new HttpParams()
          .set('productId', productId)
          .set('page', page.toString())
          .set('limit', limit.toString());
    
        return this.http.get<ProductPagination>(`${productBaseUrl}/related`, { params });
    }

}