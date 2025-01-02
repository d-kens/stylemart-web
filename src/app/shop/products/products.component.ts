import { Component, effect, inject } from '@angular/core';
import { ProductsFilterComponent } from './products-filter/products-filter.component';
import { CommonModule } from '@angular/common';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { Product, ProductFilter, ProductPagination } from '../../admin/data-access/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { filter } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductsFilterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  category = injectQueryParams('category');
  size = injectQueryParams('size');
  sort = injectQueryParams('sort');

  currentPage = 1;
  itemsPerPage = 10;

  products: Product[] = [];
  lastCategory = '';

  protected readonly filter = filter;

  router = inject(Router)
  toastService = inject(ToastrService)
  productService = inject(ProductService)


  filterProducts: ProductFilter = {
    categoryId: this.category(),
    size: this.size() ? this.size()! : "",
  }


  constructor() {
    effect(() => this.handleParametersChange());
    this.fetchProducts();
  }


  onFilterChange(filterProducts: ProductFilter) {
    filterProducts.categoryId = this.category();
    this.filterProducts = filterProducts;
    this.router.navigate(['/products'], {
      queryParams: {
        ...filterProducts,
      },
    });
    
    this.fetchProducts(); 
  }


  private fetchProducts() {
    this.productService.findAllProducts(
      this.currentPage,
      this.itemsPerPage,
      this.filterProducts.categoryId || undefined,
      this.filterProducts.size
    ).subscribe({
      next: (response: ProductPagination) => {
        this.products = response.items;
        this.currentPage = response.meta.currentPage;
        this.itemsPerPage = response.meta.itemsPerPage;
      },
      error: (error) => {
        this.toastService.error('Failed to fetch products');
        console.log(error.message);
      }
    })
  }


  private handleParametersChange() {
    if (this.category()) {
      if (this.lastCategory != this.category() && this.lastCategory !== '') {
        this.filterProducts = {
          categoryId: this.category(),
          size: this.size() ? this.size()! : '',
        };
        this.fetchProducts();
      }
    }
    this.lastCategory = this.category()!;
  }


}
