import { Component } from '@angular/core';
import { Search } from '../services/search';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.less',
  standalone: true  
})
export class SearchBar {
  query: string = '';
  results: string[] = [];

  constructor(private searchService: Search) { }

  search() {
    if (!this.query.trim()) return;
    this.searchService.search(this.query).subscribe({
      next: (res: any) => {
        this.results = res.results;
      },
      error: (err) => {
        alert('Erreur de recherche : ' + err.error?.error);
      }
    });
  }
}
