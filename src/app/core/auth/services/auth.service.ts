import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '@core/models/user.model';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private loggedIn = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<User | null>(null);

  private readonly API_URL = `auth/login`;
  private readonly TOKEN_KEY = 'accessToken';

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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (token) {
        // Here you might want to validate the token with your backend
        // For this demo, we'll just assume it's valid
        this.loggedIn.next(true);
        // You could also fetch user data again based on the token
      }
    }
  }

  login(credentials: { username: string; password: string }): Observable<User> {
    return this.apiService.post<User>(this.API_URL, credentials).pipe(
      tap((user) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.TOKEN_KEY, user.accessToken);
        }
        this.loggedIn.next(true);
        this.user.next(user);
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.loggedIn.next(false);
    this.user.next(null);
    this.router.navigate(['/login']);
  }
}
