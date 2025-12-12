import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Search {
  private apiUrl = 'http://localhost:3000/api/search';

  constructor(private http: HttpClient) { }

  search(query: string) {
    return this.http.get(`${this.apiUrl}/?q=${encodeURIComponent(query)}`);
  }
}
