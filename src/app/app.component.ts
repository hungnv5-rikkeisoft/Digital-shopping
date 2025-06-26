import { Component, inject } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthService } from '@core/auth/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@core/models/user.model';
import * as FavoritesActions from '@core/state/favorites/favorites.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

  title = 'Angular-webshop';
  isMenuOpen = false;
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  constructor() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentUser$ = this.authService.currentUser$;

    // Load favorites from localStorage on app initialization
    this.store.dispatch(FavoritesActions.loadFavorites());
  }

  get showHero(): boolean {
    return this.router.url === '/' || this.router.url === '/products';
  }

  get showFooter(): boolean {
    return this.router.url !== '/login';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isMenuOpen = false;
  }

  scrollToMainContent(): void {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
