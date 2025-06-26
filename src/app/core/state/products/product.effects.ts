import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import * as ProductActions from './product.actions';
import { ProductService } from '@features/products/services/product.service';
import {
  selectCurrentPage,
  selectSearchQuery,
  selectSelectedCategory,
} from './product.selectors';
import { ProductsResponse } from '@core/models/product.model';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);
  private store = inject(Store);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      withLatestFrom(
        this.store.select(selectCurrentPage),
        this.store.select(selectSearchQuery),
        this.store.select(selectSelectedCategory)
      ),
      switchMap(([action, currentPage, searchQuery, selectedCategory]) => {
        const page = action.page || currentPage;
        const limit = action.limit || 30;
        const search = action.search || searchQuery;
        const category = action.category || selectedCategory;

        return this.productService
          .getProductsWithPagination({ page, limit, search, category })
          .pipe(
            map((response: ProductsResponse) =>
              ProductActions.loadProductsSuccess({ response })
            ),
            catchError((error) =>
              of(ProductActions.loadProductsFailure({ error: error.message }))
            )
          );
      })
    )
  );

  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.searchProducts),
      map(({ query }) =>
        ProductActions.loadProducts({ search: query, page: 1 })
      )
    )
  );

  filterProductsByCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.filterProductsByCategory),
      map(({ category }) => ProductActions.loadProducts({ category, page: 1 }))
    )
  );

  clearFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.clearFilters),
      map(() =>
        ProductActions.loadProducts({ search: '', category: '', page: 1 })
      )
    )
  );
}
