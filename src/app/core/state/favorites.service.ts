import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'webshop_favorites';
  private favoritesSubject = new BehaviorSubject<Product[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

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

  isFavorite(productId: number): boolean {
    return this.favoritesSubject.value.some((fav) => fav.id === productId);
  }

  getFavoritesCount(): number {
    return this.favoritesSubject.value.length;
  }

  toggleFavorite(
    product: Product
  ): Observable<{ product: Product; isAdded: boolean }> {
    const isFav = this.isFavorite(product.id);

    if (isFav) {
      this.removeFromFavorites(product.id);
      return of({ product, isAdded: false });
    } else {
      this.addToFavorites(product);
      return of({ product, isAdded: true });
    }
  }

  private loadFavoritesFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const favorites = JSON.parse(stored) as Product[];
        this.favoritesSubject.next(favorites);
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      this.favoritesSubject.next([]);
    }
  }

  private saveFavoritesToStorage(favorites: Product[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }
}
