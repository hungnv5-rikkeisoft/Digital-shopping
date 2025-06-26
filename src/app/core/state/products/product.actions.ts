import { createAction, props } from '@ngrx/store';
import { Product, ProductsResponse } from '../../models/product.model';

// Load Products Actions
export const loadProducts = createAction(
  '[Product] Load Products',
  props<{ page?: number; limit?: number; search?: string; category?: string }>()
);

export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ response: ProductsResponse }>()
);

export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: string }>()
);

// Search Products Actions
export const searchProducts = createAction(
  '[Product] Search Products',
  props<{ query: string }>()
);

// Filter Products Actions
export const filterProductsByCategory = createAction(
  '[Product] Filter Products By Category',
  props<{ category: string }>()
);

export const clearFilters = createAction('[Product] Clear Filters');

// Set Loading State
export const setProductsLoading = createAction(
  '[Product] Set Loading',
  props<{ loading: boolean }>()
);
