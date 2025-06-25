import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = environment.API_BASE_URL;

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.API_BASE_URL}${path}`, { params });
  }

  post<T>(path: string, body: object = {}): Observable<T> {
    return this.http.post<T>(
      `${this.API_BASE_URL}${path}`,
      JSON.stringify(body),
      {
        headers: this.setHeaders(),
      }
    );
  }

  put<T>(path: string, body: object = {}): Observable<T> {
    return this.http.put<T>(
      `${this.API_BASE_URL}${path}`,
      JSON.stringify(body),
      {
        headers: this.setHeaders(),
      }
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.API_BASE_URL}${path}`, {
      headers: this.setHeaders(),
    });
  }

  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    return new HttpHeaders(headersConfig);
  }
}
