import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Filesystem } from '../services/filesystem';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-tree-view',
  imports: [CommonModule],
  templateUrl: './tree-view.html',
  styleUrl: './tree-view.less',
  standalone: true
})
export class TreeView {
  tree: any[] = [];
  selectedFolder: any = null;
  racine: any = {
    name: "/",
    path: environment.filesystem.rootPath,
    isDirectory: true
  }

  constructor(private fsService: Filesystem, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadTree();
  }

  loadTree() {
    this.fsService.getTree().subscribe({
      next: (res: any) => {
         const apiFolders = res.tree || [];
        this.tree = [this.racine, ...apiFolders];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur arborescence:', err)
    });
  }

  selectItem(item: any) {
    this.selectedFolder = item;
    this.onFolderSelect.emit(item);
  }

  @Output() onFolderSelect = new EventEmitter<any>();

}
