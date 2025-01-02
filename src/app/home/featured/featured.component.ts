import { Component, inject, OnInit } from '@angular/core';
import { Product, ProductPagination } from '../../admin/data-access/models/product.model';
import { AdminProducService } from '../../admin/data-access/services/admin-product.service';
import { ProductCardComponent } from '../../shop/product-card/product-card.component';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-featured',
  imports: [ProductCardComponent],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss'
})
export class FeaturedComponent implements OnInit {

  products: Product[] = [];
  loading: boolean = false; 
  error: boolean = false;

  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;


  private productService = inject(ProductService);

  ngOnInit(): void {
    this.fetchProducts(this.currentPage, this.itemsPerPage);
  }

  fetchProducts(page: number, limit: number) {
    this.loading = true;

    this.productService.findAllProducts(page, limit).subscribe({
      next: (response: ProductPagination) => {
        this.products = response.items;
        this.currentPage = response.meta.currentPage;
        this.itemsPerPage = response.meta.itemsPerPage;
        this.loading = false;
      },
      error: (error) => {
        this.error = true;
        this.loading = false;
      }
    })
  }

}
