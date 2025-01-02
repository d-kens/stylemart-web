import { Component, effect, inject } from '@angular/core';
import { ProductsFilterComponent } from './products-filter/products-filter.component';
import { CommonModule } from '@angular/common';
import { Product, ProductFilter, ProductPagination } from '../../admin/data-access/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductsFilterComponent, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  currentPage = 1;
  itemsPerPage = 10;
  products: Product[] = [];
  lastCategory = '';
  loading: boolean = false

  protected readonly filter = filter;

  router = inject(Router);
  toastService = inject(ToastrService);
  productService = inject(ProductService);
  
  // Injecting ActivatedRoute
  private activatedRoute = inject(ActivatedRoute);

  filterProducts: ProductFilter = {
    categoryId: '',
    size: '',
  };

  constructor() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.filterProducts.categoryId = params['categoryId'] || '';
      this.filterProducts.size = params['size'] || '';
      console.log(
        "URL CHANGING"
      )
      this.fetchProducts();
    });
  }

  onFilterChange(filterProducts: ProductFilter) {
    filterProducts.categoryId = this.filterProducts.categoryId;

    this.router.navigate(['/products'], {
      queryParams: {
        ...filterProducts,
      },
    });
  }

  private fetchProducts() {
    this.loading = true;

    this.productService.findAllProducts(
      this.currentPage,
      this.itemsPerPage,
      this.filterProducts.categoryId || undefined,
      this.filterProducts.size || undefined
    ).subscribe({
      next: (response: ProductPagination) => {
        this.products = response.items;
        this.currentPage = response.meta.currentPage;
        this.itemsPerPage = response.meta.itemsPerPage;
        this.loading = false;
      },
      error: (error) => {
        this.toastService.error('Failed to fetch products');
        this.loading = false;
      }
    });
  }
}
