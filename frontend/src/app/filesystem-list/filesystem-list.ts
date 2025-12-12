import { Component, EventEmitter, Input, Output, ChangeDetectorRef, HostListener  } from '@angular/core';
import { Filesystem } from '../services/filesystem';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filesystem-list',
  imports: [CommonModule],
  templateUrl: './filesystem-list.html',
  styleUrl: './filesystem-list.less',
  standalone: true
})
export class FilesystemList {

  @Input() selectedFolder: any = null;
  @Output() onFileSelect = new EventEmitter<any>();
  files: any[] = [];
  selectedFileIndex: number = -1;
  selectedFile: any = null;

  constructor(private fsService: Filesystem, private cdr: ChangeDetectorRef) { }

  ngOnChanges() {
    console.log('📁 FileBrowser reçoit selectedFolder :', this.selectedFolder);
    if (this.selectedFolder && this.selectedFolder.isDirectory) {
      this.loadFiles();
    } else {
      this.selectedFileIndex = -1;
      this.files = [];
    }
  }

  loadFiles() {
    console.log('📥 Chargement des fichiers de :', this.selectedFolder.path);
    this.fsService.getFiles(this.selectedFolder.path).subscribe({
      next: (res: any) => {
        console.log('✅ Fichiers reçus :', res.files);
        this.files = res.files;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur chargement fichiers :', err);
      }
    });
  }

  selectFile(item: any, index: number) {
    if(item.isDirectory) {
      this.selectedFolder = item;
      this.loadFiles();
    } else {
      this.selectedFileIndex = index;
      this.selectedFile = item;
      this.onFileSelect.emit(item);
    }
  }

    getFileTypeIcon(file: any): string {
    if (file.isDirectory) {
      return '📁'; // Dossier
    }

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension) return '📎'; // Fichier sans extension

    // 🖼️ Images
    if (this.isImage(file)) { return '🖼️'; }
    // 📄 PDF
    if (this.isPdf(file)) { return '📄'; }
    // ▶️ Vidéos 
    if (this.isVideo(file)) { return '▶️'; }
    // 💻 Code
    if (this.isText(file)) { return '💻'; }
    // 📦 Autres fichiers (zip, exe, doc, etc.) 
    return '📎';
  }

  // ✅ Vérifie si c’est une image
  isImage(file: any): boolean {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico'].includes(ext || '');
  }

  // ✅ Vérifie si c’est une vidéo
  isVideo(file: any): boolean {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext || '');
  }

  // ✅ Vérifie si c’est un PDF
  isPdf(file: any): boolean {
    return file.name.toLowerCase().endsWith('.pdf');
  }

  // ✅ Vérifie si c’est un fichier texte
  isText(file: any): boolean {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ['txt', 'md', 'json', 'xml', 'yml', 'yaml', 'js', 'ts', 'css', 'html', 'py', 'java', 'php'].includes(ext || '');
  }

  // ✅ Retourne le type affiché
  getDisplayType(file: any): string {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (this.isImage(file)) return 'Image';
    if (this.isVideo(file)) return 'Vidéo';
    if (this.isPdf(file)) return 'PDF';
    if (this.isText(file)) return 'Texte';
    return ext ? ext.toUpperCase() : 'Fichier';
  }

  // ✅ Retourne le chemin complet du fichier pour l’affichage
  getFile(file: any): string {
    console.log( file );
    // ✅ Assure-toi que ton backend expose les fichiers via une route comme :
    // GET /api/filesystem/file?path=/chemin/absolu/fichier.jpg
    // this.fsService.getFile(file.path).sub;

    return "";
  }

  @HostListener('document:keydown.arrowup', ['$event'])
  @HostListener('document:keydown.arrowdown', ['$event'])
  handleKeyboardEvent(event: any) {
    // ✅ Ne réagit QUE si un fichier est sélectionné ET qu'on est dans le composant
    if (this.selectedFileIndex === -1) {
      return;
    }

    event.preventDefault(); // ✅ Évite le défilement de la page

    let newIndex = this.selectedFileIndex;

    if (event.key === 'ArrowUp') {
      newIndex = this.selectedFileIndex > 0 ? this.selectedFileIndex - 1 : this.files.length - 1; // ✅ Reboucle
    } else if (event.key === 'ArrowDown') {
      newIndex = (this.selectedFileIndex + 1) % this.files.length; // ✅ Reboucle
    }

    // ✅ Sélectionne le nouveau fichier
    this.selectFile(this.files[newIndex], newIndex);

    // ✅ Fait défiler automatiquement pour que le fichier soit visible
    const itemElement = document.querySelector(`[data-index="${newIndex}"]`);
    if (itemElement) {
      itemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}
