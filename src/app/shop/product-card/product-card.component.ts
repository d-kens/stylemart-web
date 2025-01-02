import { Component, input } from '@angular/core';
import { Product } from '../../admin/data-access/models/product.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  product = input.required<Product>();

  getDiscountedPrice(price: number): number {
    return Number(price) + 200;
  }

}
