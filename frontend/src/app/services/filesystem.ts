import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Filesystem {
  private apiUrl = 'http://localhost:3000/api/filesystem';

  constructor(private http: HttpClient) { }

  getTree() {
    return this.http.get(`${this.apiUrl}/tree`);
  }

  getFiles(path: string) {
    return this.http.get(`${this.apiUrl}/content?path=${encodeURIComponent(path)}`);
  }

  getFile(path: string) {
    return this.http.get(`${this.apiUrl}/file?path=${encodeURIComponent(path)}`);
  }
}
