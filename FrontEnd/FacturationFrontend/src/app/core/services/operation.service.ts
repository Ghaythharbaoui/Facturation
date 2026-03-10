import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Operation, CreateOperationRequest } from '../models/operation.model';

@Injectable({
    providedIn: 'root'
})
export class OperationService {

    private readonly apiUrl = `${environment.apiUrl}/operations`;

    constructor(private http: HttpClient) { }

    addOperation(request: CreateOperationRequest): Observable<Operation> {
        return this.http.post<Operation>(this.apiUrl, request);
    }

    getOperations(): Observable<Operation[]> {
        return this.http.get<Operation[]>(this.apiUrl);
    }

    getOperationById(id: number): Observable<Operation> {
        return this.http.get<Operation>(`${this.apiUrl}/${id}`);
    }

    deletOperation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);

    }
}
