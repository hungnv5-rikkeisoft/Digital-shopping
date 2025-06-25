import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState, adapter } from './favorites.reducer';

export const selectFavoritesState =
  createFeatureSelector<FavoritesState>('favorites');

// Entity Selectors
const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();

export const selectAllFavorites = createSelector(
  selectFavoritesState,
  selectAll
);

export const selectFavoriteEntities = createSelector(
  selectFavoritesState,
  selectEntities
);

export const selectFavoriteIds = createSelector(
  selectFavoritesState,
  selectIds
);

export const selectTotalFavorites = createSelector(
  selectFavoritesState,
  selectTotal
);

// State Property Selectors
export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state) => state.loading
);

export const selectFavoritesError = createSelector(
  selectFavoritesState,
  (state) => state.error
);

export const selectFavoritesCount = createSelector(
  selectFavoritesState,
  (state) => state.count
);

// Computed Selectors
export const selectIsFavorite = (productId: number) =>
  createSelector(selectFavoriteEntities, (entities) => !!entities[productId]);

export const selectFavoriteById = (id: number) =>
  createSelector(selectFavoriteEntities, (entities) => entities[id]);

export const selectHasFavorites = createSelector(
  selectFavoritesCount,
  (count) => count > 0
);

export const selectFavoritesOrderedByDate = createSelector(
  selectAllFavorites,
  (favorites) => [...favorites].reverse() // Assuming latest added are at the end
);
