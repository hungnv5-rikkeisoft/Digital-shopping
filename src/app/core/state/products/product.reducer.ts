import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Product } from '../../models/product.model';
import * as ProductActions from './product.actions';

export interface ProductState extends EntityState<Product> {
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  searchQuery: string;
  selectedCategory: string;
  filters: {
    category: string;
    priceRange: { min: number; max: number };
    rating: number;
  };
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

export const initialState: ProductState = adapter.getInitialState({
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  searchQuery: '',
  selectedCategory: '',
  filters: {
    category: '',
    priceRange: { min: 0, max: 10000 },
    rating: 0,
  },
});

export const productReducer = createReducer(
  initialState,

  // Load Products
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductActions.loadProductsSuccess, (state, { response }) =>
    adapter.setAll(response.products, {
      ...state,
      loading: false,
      error: null,
      total: response.total,
      currentPage: Math.floor(response.skip / response.limit) + 1,
    })
  ),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Search and Filter
  on(ProductActions.searchProducts, (state, { query }) => ({
    ...state,
    searchQuery: query,
  })),

  on(ProductActions.filterProductsByCategory, (state, { category }) => ({
    ...state,
    selectedCategory: category,
    filters: {
      ...state.filters,
      category,
    },
  })),

  on(ProductActions.clearFilters, (state) => ({
    ...state,
    searchQuery: '',
    selectedCategory: '',
    filters: {
      category: '',
      priceRange: { min: 0, max: 10000 },
      rating: 0,
    },
  })),

  // Set Loading
  on(ProductActions.setProductsLoading, (state, { loading }) => ({
    ...state,
    loading,
  }))
);
