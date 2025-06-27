import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { StorageService } from './storage.service';

export interface ApiRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.API_BASE_URL;
  private storageService = inject(StorageService);

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options);
  }

  post<T>(
    endpoint: string,
    data: any,
    options?: ApiRequestOptions
  ): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, options);
  }

  put<T>(
    endpoint: string,
    data: any,
    options?: ApiRequestOptions
  ): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, options);
  }

  patch<T>(
    endpoint: string,
    data: any,
    options?: ApiRequestOptions
  ): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data, options);
  }

  delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options);
  }

  // Helper method for authenticated requests
  getAuthHeaders(token?: string): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token || this.getStoredToken()) {
      headers = headers.set(
        'Authorization',
        `Bearer ${token || this.getStoredToken()}`
      );
    }

    return headers;
  }

  private getStoredToken(): string | null {
    return this.storageService.getItem('accessToken');
  }
}
