import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '@core/models/user.model';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { StorageService } from '@core/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private storageService = inject(StorageService);

  private loggedIn = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<User | null>(null);

  private readonly API_URL = `auth/login`;
  private readonly TOKEN_KEY = 'accessToken';
  private readonly USER_KEY = 'currentUser';

  constructor() {
    this.checkToken();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUser$(): Observable<User | null> {
    return this.user.asObservable();
  }

  private checkToken(): void {
    const token = this.storageService.getItem(this.TOKEN_KEY);
    const userData = this.storageService.getItem(this.USER_KEY);

    if (token && userData) {
      try {
        const user: User = JSON.parse(userData);
        this.loggedIn.next(true);
        this.user.next(user);
      } catch (error) {
        // If user data is corrupted, clear everything
        this.clearStoredData();
      }
    }
  }

  private clearStoredData(): void {
    this.storageService.removeItem(this.TOKEN_KEY);
    this.storageService.removeItem(this.USER_KEY);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>(this.API_URL, credentials).pipe(
      tap((response) => {
        // Extract user info from login response
        const user: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          gender: response.gender,
          image: response.image,
        };

        this.storageService.setItem(this.TOKEN_KEY, response.token);
        this.storageService.setItem(this.USER_KEY, user);

        this.loggedIn.next(true);
        this.user.next(user);
      })
    );
  }

  logout(): void {
    this.clearStoredData();
    this.loggedIn.next(false);
    this.user.next(null);
    this.router.navigate(['/login']);
  }
}
