import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TreeView } from './tree-view/tree-view';
import { MetadataForm } from './metadata-form/metadata-form';
import { SearchBar } from './search-bar/search-bar';
import { FilesystemList } from './filesystem-list/filesystem-list';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    TreeView,
    FilesystemList,
    MetadataForm,
    SearchBar
  ],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App {
  selectedFolder: any = null;
  selectedFile: any = null;

  private readonly ROOT_PATH = environment.filesystem.rootPath;

  constructor() {
    this.selectedFolder = {
      name: '/',
      path: this.ROOT_PATH,
      isDirectory: true
    };
  }

  onFolderSelect(folder: any) {
    this.selectedFolder = { ...folder };
    this.selectedFile = null;
  }

  onFileSelect(file: any) {
    this.selectedFile = file;
  }
}
