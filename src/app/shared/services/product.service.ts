import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Product, ProductCategory, ProductPagination } from "../../admin/data-access/models/product.model";


const categoryBaseUrl = environment.categories.baseUrl;
const productBaseUrl = environment.products.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class ProductService {


    http = inject(HttpClient);

    findAllCategories(): Observable<ProductCategory[]> {
        return this.http.get<ProductCategory[]>(`${categoryBaseUrl}`)
    }

    findAllProducts(page: number = 1, limit: number = 10, categoryId?: string, sizes?: string): Observable<ProductPagination> {
        let params = new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString());

        if (categoryId) {
            params = params.set('categoryId', categoryId);
        }

        if (sizes) {
            params = params.set('size', sizes);
        }
        
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