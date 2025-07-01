import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

import { AppState } from '@core/state/app.state';
import { Product } from '@core/models/product.model';
import {
  selectAllFavorites,
  selectFavoritesLoading,
  selectFavoritesError,
  selectFavoritesCount,
  selectHasFavorites,
  selectFavoriteIds,
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
export class FavoritesListComponent implements OnInit, OnDestroy {
  favorites$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  count$: Observable<number>;
  hasFavorites$: Observable<boolean>;

  // Local state for products that were unmarked but should remain visible
  private temporarilyVisibleProducts$ = new BehaviorSubject<Product[]>([]);
  private favoriteIds$: Observable<readonly (string | number)[]>;

  constructor(private store: Store<AppState>) {
    this.loading$ = this.store.select(selectFavoritesLoading);
    this.error$ = this.store.select(selectFavoritesError);
    this.count$ = this.store.select(selectFavoritesCount);
    this.favoriteIds$ = this.store.select(selectFavoriteIds);

    // Combine actual favorites with temporarily visible products
    this.favorites$ = combineLatest([
      this.store.select(selectAllFavorites),
      this.temporarilyVisibleProducts$,
      this.favoriteIds$,
    ]).pipe(
      map(([actualFavorites, temporaryProducts, favoriteIds]) => {
        // Filter temporary products to only include those not currently in favorites
        const filteredTemporaryProducts = temporaryProducts.filter(
          (product) => !favoriteIds.includes(product.id)
        );

        // Combine and remove duplicates
        const combinedProducts = [
          ...actualFavorites,
          ...filteredTemporaryProducts,
        ];
        const uniqueProducts = combinedProducts.filter(
          (product, index, array) =>
            array.findIndex((p) => p.id === product.id) === index
        );

        return uniqueProducts;
      })
    );

    // Update hasFavorites$ to consider both actual favorites and temporarily visible products
    this.hasFavorites$ = this.favorites$.pipe(
      map((products) => products.length > 0)
    );
  }

  ngOnInit(): void {
    // Load favorites from localStorage
    this.store.dispatch(FavoritesActions.loadFavorites());
  }

  ngOnDestroy(): void {
    // Clear temporarily visible products when navigating away
    this.temporarilyVisibleProducts$.next([]);
    this.temporarilyVisibleProducts$.complete();
  }

  onClearAllFavorites(): void {
    this.temporarilyVisibleProducts$.next([]);
    this.temporarilyVisibleProducts$.complete();
    this.store.dispatch(FavoritesActions.clearFavorites());
  }

  onToggleFavorite(product: Product): void {
    // Check if product is currently in actual favorites
    this.favoriteIds$.pipe(take(1)).subscribe((favoriteIds) => {
      const isCurrentlyFavorite = favoriteIds.includes(product.id);

      if (isCurrentlyFavorite) {
        // If it's a favorite, remove it and add to temporarily visible
        const currentTemporary = this.temporarilyVisibleProducts$.value;
        const isAlreadyTemporary = currentTemporary.some(
          (p) => p.id === product.id
        );

        if (!isAlreadyTemporary) {
          this.temporarilyVisibleProducts$.next([...currentTemporary, product]);
        }
      } else {
        // If it's not a favorite, remove from temporarily visible if present
        const currentTemporary = this.temporarilyVisibleProducts$.value;
        const filteredTemporary = currentTemporary.filter(
          (p) => p.id !== product.id
        );
        this.temporarilyVisibleProducts$.next(filteredTemporary);
      }
    });

    // Toggle in store
    this.store.dispatch(FavoritesActions.toggleFavorite({ product }));
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  // Helper method to check if a product is temporarily visible (unfavorited but still shown)
  isTemporarilyVisible(productId: number): boolean {
    const temporaryProducts = this.temporarilyVisibleProducts$.value;
    return temporaryProducts.some((p) => p.id === productId);
  }
}
