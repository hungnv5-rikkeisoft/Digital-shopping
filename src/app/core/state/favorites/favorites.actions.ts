import { createAction, props } from '@ngrx/store';
import { Product } from '@core/models/product.model';

// Add to Favorites
export const addToFavorites = createAction(
  '[Favorites] Add to Favorites',
  props<{ product: Product }>()
);

export const addToFavoritesSuccess = createAction(
  '[Favorites] Add to Favorites Success',
  props<{ product: Product }>()
);

export const addToFavoritesFailure = createAction(
  '[Favorites] Add to Favorites Failure',
  props<{ error: string }>()
);

// Remove from Favorites
export const removeFromFavorites = createAction(
  '[Favorites] Remove from Favorites',
  props<{ productId: number }>()
);

export const removeFromFavoritesSuccess = createAction(
  '[Favorites] Remove from Favorites Success',
  props<{ productId: number }>()
);

export const removeFromFavoritesFailure = createAction(
  '[Favorites] Remove from Favorites Failure',
  props<{ error: string }>()
);

// Load Favorites
export const loadFavorites = createAction('[Favorites] Load Favorites');

export const loadFavoritesSuccess = createAction(
  '[Favorites] Load Favorites Success',
  props<{ favorites: Product[] }>()
);

export const loadFavoritesFailure = createAction(
  '[Favorites] Load Favorites Failure',
  props<{ error: string }>()
);

// Clear Favorites
export const clearFavorites = createAction('[Favorites] Clear Favorites');

export const clearFavoritesSuccess = createAction(
  '[Favorites] Clear Favorites Success'
);

// Toggle Favorite
export const toggleFavorite = createAction(
  '[Favorites] Toggle Favorite',
  props<{ product: Product }>()
);
