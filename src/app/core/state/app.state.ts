import { ProductState } from './products/product.reducer';
import { FavoritesState } from './favorites/favorites.reducer';

export interface AppState {
  products: ProductState;
  favorites: FavoritesState;
}
