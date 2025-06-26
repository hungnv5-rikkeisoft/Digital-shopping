import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import * as FavoritesActions from './favorites.actions';
import { FavoritesService } from '../favorites.service';
import { Product } from '@core/models/product.model';
import { selectAllFavorites } from './favorites.selectors';

@Injectable()
export class FavoritesEffects {
  private actions$ = inject(Actions);
  private favoritesService = inject(FavoritesService);
  private store = inject(Store);

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      switchMap(() =>
        this.favoritesService.getFavorites().pipe(
          map((favorites: Product[]) =>
            FavoritesActions.loadFavoritesSuccess({ favorites })
          ),
          catchError((error) =>
            of(FavoritesActions.loadFavoritesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addToFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.addToFavorites),
      switchMap(({ product }) =>
        this.favoritesService.addToFavorites(product).pipe(
          map(() => FavoritesActions.addToFavoritesSuccess({ product })),
          catchError((error) =>
            of(FavoritesActions.addToFavoritesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  removeFromFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.removeFromFavorites),
      switchMap(({ productId }) =>
        this.favoritesService.removeFromFavorites(productId).pipe(
          map(() => FavoritesActions.removeFromFavoritesSuccess({ productId })),
          catchError((error) =>
            of(
              FavoritesActions.removeFromFavoritesFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  clearFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.clearFavorites),
      switchMap(() =>
        this.favoritesService.clearFavorites().pipe(
          map(() => FavoritesActions.clearFavoritesSuccess()),
          catchError((error) =>
            of(FavoritesActions.addToFavoritesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Side effect for saving to localStorage without dispatching new actions
  saveFavoritesToStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          FavoritesActions.addToFavoritesSuccess,
          FavoritesActions.removeFromFavoritesSuccess,
          FavoritesActions.clearFavoritesSuccess,
          FavoritesActions.toggleFavorite
        ),
        withLatestFrom(this.store.select(selectAllFavorites)),
        tap(([action, favorites]) => {
          try {
            localStorage.setItem(
              'webshop_favorites',
              JSON.stringify(favorites)
            );
          } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
          }
        })
      ),
    { dispatch: false }
  );
}
