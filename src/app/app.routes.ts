import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { ProductListComponent } from './features/products/pages/product-list/product-list.component';
import { FavoritesListComponent } from './features/favorites/pages/favorites-list/favorites-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'products',
    component: ProductListComponent,
    // canActivate: [authGuard] // Will be added later
  },
  {
    path: 'favorites',
    component: FavoritesListComponent,
    // canActivate: [authGuard] // Will be added later
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'products',
    pathMatch: 'full',
  },
];
