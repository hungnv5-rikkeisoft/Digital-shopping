import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '@core/state/app.state';
import { Product } from '@core/models/product.model';
import {
  selectAllFavorites,
  selectFavoritesLoading,
  selectFavoritesError,
  selectFavoritesCount,
  selectHasFavorites,
  FavoritesActions,
} from '@core/state';
import { ProductCardComponent } from '@shared/ui/product-card/product-card.component';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './favorites-list.component.html',
  styleUrl: './favorites-list.component.scss',
})
export class FavoritesListComponent implements OnInit {
  favorites$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  count$: Observable<number>;
  hasFavorites$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.favorites$ = this.store.select(selectAllFavorites);
    this.loading$ = this.store.select(selectFavoritesLoading);
    this.error$ = this.store.select(selectFavoritesError);
    this.count$ = this.store.select(selectFavoritesCount);
    this.hasFavorites$ = this.store.select(selectHasFavorites);
  }

  ngOnInit(): void {
    // Load favorites from localStorage
    this.store.dispatch(FavoritesActions.loadFavorites());
  }

  onRemoveFromFavorites(productId: number): void {
    this.store.dispatch(FavoritesActions.removeFromFavorites({ productId }));
  }

  onClearAllFavorites(): void {
    this.store.dispatch(FavoritesActions.clearFavorites());
  }

  onToggleFavorite(product: Product): void {
    this.store.dispatch(FavoritesActions.toggleFavorite({ product }));
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
