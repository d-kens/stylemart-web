import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product, ProductPagination } from '../../admin/data-access/models/product.model';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartService } from '../../shared/services/cart.service';
import { interval, take } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FontAwesomeModule,ProductCardComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  productId: string = '';
  product!: Product;
  loading: boolean = false; 
  error: boolean = false;
  relatedProducts: Product[] = [];

  labelAddToCart = 'Add to cart';
  iconAddToCart = 'shopping-cart';
 
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.productId = params['productId'];
    });
  }

  ngOnInit(): void {
    this.fetchProductDetails();
    console.log(this.product)
  }


  fetchProductDetails() {
    this.loading = true;

    this.productService.findProudctById(this.productId).subscribe({
      next: (product: Product) => {
        this.product = product;
        console.log(product)
        this.loading = false;
        this.fetchRelatedProducts();
      },
      error: (error) => {
        console.error('Failed to fetch product details:', error);
        this.error = true;
        this.loading = false;
      }
     });

  }

  fetchRelatedProducts() {
    this.productService.findRelatedProducts(this.productId).subscribe({
      next: (response: ProductPagination) => {
        this.relatedProducts = response.items;
      },
      error: (error) => {
        console.error('Failed to fetch related products:', error);
      }
    })
  }

  getDiscountedPrice(price: number): number {
    return Number(price) + 200;
  }

  addToCart(product: Product) {
    console.log("Add to cart button clicked")
    this.cartService.updateCart({
      id: product.id!,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    }, 'add');
    this.labelAddToCart = 'Added to cart';
    this.iconAddToCart = 'check';

    interval(3000).pipe(take(1)).subscribe(() => {
      this.labelAddToCart = 'Add to cart';
      this.iconAddToCart ='shopping-cart';
    })
  }
}
