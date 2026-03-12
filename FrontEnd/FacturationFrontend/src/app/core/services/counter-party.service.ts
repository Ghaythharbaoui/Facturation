import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CounterParty, CreateCounterPartyRequest } from '../models/counter-party.model';

@Injectable({
    providedIn: 'root'
})
export class CounterPartyService {

    private readonly apiUrl = `${environment.apiUrl}/counterparties`;

    constructor(private http: HttpClient) { }

    addCounterParty(request: CreateCounterPartyRequest): Observable<CounterParty> {
        return this.http.post<CounterParty>(this.apiUrl, request);
    }

    getCounterParties(): Observable<CounterParty[]> {
        return this.http.get<CounterParty[]>(this.apiUrl);
    }

    getCounterPartyById(id: number): Observable<CounterParty> {
        return this.http.get<CounterParty>(`${this.apiUrl}/${id}`);
    }

    deleteCounterParty(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
