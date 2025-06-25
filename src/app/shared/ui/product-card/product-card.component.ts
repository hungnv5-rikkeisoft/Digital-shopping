import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Product } from '../../../core/models/product.model';
import { AppState } from '../../../core/state/app.state';
import { selectIsFavorite } from '../../../core/state';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() showFavoriteButton = true;
  @Output() toggleFavorite = new EventEmitter<Product>();
  @Output() productClick = new EventEmitter<Product>();

  isFavorite$: Observable<boolean> = new Observable();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    if (this.product) {
      this.isFavorite$ = this.store.select(selectIsFavorite(this.product.id));
    }
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavorite.emit(this.product);
  }

  onProductClick(): void {
    this.productClick.emit(this.product);
  }

  getRatingStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    if (hasHalfStar) {
      stars.push('half');
    }

    while (stars.length < 5) {
      stars.push('empty');
    }

    return stars;
  }

  getDiscountedPrice(price: number, discount: number): number {
    return price - (price * discount) / 100;
  }
}
