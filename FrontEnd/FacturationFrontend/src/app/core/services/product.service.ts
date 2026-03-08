import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, CreateProductRequest, UpdateProductRequest, ProductFilter } from '../models/product.model';
import { PageResponse } from '../models/page.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private readonly apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    getProducts(filter: ProductFilter): Observable<PageResponse<Product>> {
        let params = new HttpParams()
            .set('page', filter.page.toString())
            .set('size', filter.size.toString())
            .set('sortBy', filter.sortBy)
            .set('sortDirection', filter.sortDirection);

        if (filter.name) params = params.set('name', filter.name);
        if (filter.type) params = params.set('type', filter.type);
        if (filter.forSale !== undefined && filter.forSale !== null) params = params.set('forSale', filter.forSale.toString());
        if (filter.forPurchase !== undefined && filter.forPurchase !== null) params = params.set('forPurchase', filter.forPurchase.toString());
        if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
        if (filter.reference) params = params.set('reference', filter.reference);

        return this.http.get<PageResponse<Product>>(this.apiUrl, { params });
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(request: CreateProductRequest): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, request);
    }

    updateProduct(id: number, request: UpdateProductRequest): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, request);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    searchProducts(name: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/search`, {
            params: new HttpParams().set('name', name)
        });
    }

    getProductsForSale(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/for-sale`);
    }

    getProductsForPurchase(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/for-purchase`);
    }
}
