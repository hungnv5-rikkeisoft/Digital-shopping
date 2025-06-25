import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Product, ProductsResponse } from '@core/models/product.model';

export interface ProductQueryParams {
  limit?: number;
  skip?: number;
  q?: string; // search query
  sortBy?: string;
  order?: 'asc' | 'desc';
  select?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  // Get all products with optional parameters
  getProducts(params: ProductQueryParams = {}): Observable<ProductsResponse> {
    let httpParams = new HttpParams();

    // Add limit parameter (default 30)
    if (params.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    // Add skip parameter for pagination
    if (params.skip !== undefined) {
      httpParams = httpParams.set('skip', params.skip.toString());
    }

    // Add sortBy and order for sorting
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.order) {
      httpParams = httpParams.set('order', params.order);
    }

    // Add select for specific fields
    if (params.select) {
      httpParams = httpParams.set('select', params.select);
    }

    return this.http.get<ProductsResponse>(`${this.apiUrl}products`, {
      params: httpParams,
    });
  }

  // Search products
  searchProducts(
    query: string,
    limit = 30,
    skip = 0
  ): Observable<ProductsResponse> {
    let httpParams = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    return this.http.get<ProductsResponse>(`${this.apiUrl}products/search`, {
      params: httpParams,
    });
  }

  // Get single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}products/${id}`);
  }

  // Get products by category
  getProductsByCategory(
    category: string,
    limit = 30,
    skip = 0
  ): Observable<ProductsResponse> {
    let httpParams = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    return this.http.get<ProductsResponse>(
      `${this.apiUrl}products/category/${category}`,
      {
        params: httpParams,
      }
    );
  }

  // Helper method to convert page-based pagination to skip-based
  getProductsWithPagination(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Observable<ProductsResponse> {
    const { page = 1, limit = 30, search, category } = params;
    const skip = (page - 1) * limit;

    if (search) {
      return this.searchProducts(search, limit, skip);
    }

    if (category) {
      return this.getProductsByCategory(category, limit, skip);
    }

    return this.getProducts({ limit, skip });
  }
}
