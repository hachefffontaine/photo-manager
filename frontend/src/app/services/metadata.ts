import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Metadata {
  private apiUrl = 'http://localhost:3000/api/metadata';

  constructor(private http: HttpClient) { }

  update(filePath: string, tags: string, person: string) {
    return this.http.post(`${this.apiUrl}/update`, { filePath, tags, person });
  }
}
