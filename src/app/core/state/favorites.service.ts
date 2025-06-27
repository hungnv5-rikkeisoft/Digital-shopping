import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '@core/models/product.model';
import { StorageService } from '@core/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'webshop_favorites';
  private favoritesSubject = new BehaviorSubject<Product[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();
  private storageService = inject(StorageService);

  constructor() {
    this.loadFavoritesFromStorage();
  }

  getFavorites(): Observable<Product[]> {
    // Load from localStorage first, then return the current value
    this.loadFavoritesFromStorage();
    return of(this.favoritesSubject.value);
  }

  addToFavorites(product: Product): Observable<Product> {
    const currentFavorites = this.favoritesSubject.value;
    const exists = currentFavorites.find((fav) => fav.id === product.id);

    if (!exists) {
      const updatedFavorites = [...currentFavorites, product];
      this.favoritesSubject.next(updatedFavorites);
      this.saveFavoritesToStorage(updatedFavorites);
    }

    return of(product);
  }

  removeFromFavorites(productId: number): Observable<number> {
    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = currentFavorites.filter(
      (fav) => fav.id !== productId
    );

    this.favoritesSubject.next(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);

    return of(productId);
  }

  clearFavorites(): Observable<void> {
    this.favoritesSubject.next([]);
    this.saveFavoritesToStorage([]);
    return of(void 0);
  }

  private loadFavoritesFromStorage(): void {
    try {
      const favorites = this.storageService.getItemAsObject<Product[]>(
        this.STORAGE_KEY
      );
      if (favorites) {
        this.favoritesSubject.next(favorites);
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      this.favoritesSubject.next([]);
    }
  }

  private saveFavoritesToStorage(favorites: Product[]): void {
    try {
      this.storageService.setItem(this.STORAGE_KEY, favorites);
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }
}
