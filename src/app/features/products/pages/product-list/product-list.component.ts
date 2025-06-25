import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppState } from '@core/state/app.state';
import { Product } from '@core/models/product.model';
import {
  selectFilteredProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductCategories,
  selectSearchQuery,
  selectSelectedCategory,
  ProductActions,
  FavoritesActions,
} from '@core/state';
import { ProductCardComponent } from '@shared/ui/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  categories$: Observable<string[]>;
  searchQuery$: Observable<string>;
  selectedCategory$: Observable<string>;

  searchQuery = '';
  selectedCategory = '';

  constructor(private store: Store<AppState>) {
    this.products$ = this.store.select(selectFilteredProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
    this.categories$ = this.store.select(selectProductCategories);
    this.searchQuery$ = this.store.select(selectSearchQuery);
    this.selectedCategory$ = this.store.select(selectSelectedCategory);
  }

  ngOnInit(): void {
    // Load initial products
    this.store.dispatch(ProductActions.loadProducts({}));

    // Subscribe to search query and category changes from store
    this.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((query) => (this.searchQuery = query));

    this.selectedCategory$
      .pipe(takeUntil(this.destroy$))
      .subscribe((category) => (this.selectedCategory = category));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    this.store.dispatch(
      ProductActions.searchProducts({ query: this.searchQuery })
    );
  }

  onCategoryChange(): void {
    this.store.dispatch(
      ProductActions.filterProductsByCategory({
        category: this.selectedCategory,
      })
    );
  }

  onClearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.store.dispatch(ProductActions.clearFilters());
  }

  onToggleFavorite(product: Product): void {
    this.store.dispatch(FavoritesActions.toggleFavorite({ product }));
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
