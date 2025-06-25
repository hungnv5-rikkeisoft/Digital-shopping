import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { productReducer } from './products/product.reducer';
import { favoritesReducer } from './favorites/favorites.reducer';

// Root reducers
export const reducers: ActionReducerMap<AppState> = {
  products: productReducer,
  favorites: favoritesReducer,
};

// Export all selectors
export * from './products/product.selectors';
export * from './favorites/favorites.selectors';

// Export all actions
export * as ProductActions from './products/product.actions';
export * as FavoritesActions from './favorites/favorites.actions';

// Export state interfaces
export * from './app.state';
export type { ProductState } from './products/product.reducer';
export type { FavoritesState } from './favorites/favorites.reducer';
