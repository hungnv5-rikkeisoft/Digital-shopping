import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Product } from '../../models/product.model';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState extends EntityState<Product> {
  loading: boolean;
  error: string | null;
  count: number;
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

export const initialState: FavoritesState = adapter.getInitialState({
  loading: false,
  error: null,
  count: 0,
});

export const favoritesReducer = createReducer(
  initialState,

  // Add to Favorites
  on(FavoritesActions.addToFavorites, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(FavoritesActions.addToFavoritesSuccess, (state, { product }) =>
    adapter.addOne(product, {
      ...state,
      loading: false,
      error: null,
      count: state.count + 1,
    })
  ),

  on(FavoritesActions.addToFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Remove from Favorites
  on(FavoritesActions.removeFromFavorites, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(FavoritesActions.removeFromFavoritesSuccess, (state, { productId }) =>
    adapter.removeOne(productId, {
      ...state,
      loading: false,
      error: null,
      count: Math.max(0, state.count - 1),
    })
  ),

  on(FavoritesActions.removeFromFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Favorites
  on(FavoritesActions.loadFavorites, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) =>
    adapter.setAll(favorites, {
      ...state,
      loading: false,
      error: null,
      count: favorites.length,
    })
  ),

  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear Favorites
  on(FavoritesActions.clearFavorites, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(FavoritesActions.clearFavoritesSuccess, (state) =>
    adapter.removeAll({
      ...state,
      loading: false,
      error: null,
      count: 0,
    })
  ),

  // Toggle Favorite
  on(FavoritesActions.toggleFavorite, (state, { product }) => {
    const exists = state.entities[product.id];
    if (exists) {
      return adapter.removeOne(product.id, {
        ...state,
        count: Math.max(0, state.count - 1),
      });
    } else {
      return adapter.addOne(product, {
        ...state,
        count: state.count + 1,
      });
    }
  })
);
