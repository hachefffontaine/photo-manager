import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Metadata } from '../services/metadata';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-metadata-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './metadata-form.html',
  styleUrl: './metadata-form.less',
  standalone: true
})
export class MetadataForm {
  @Input() selectedFile: any = null;
  @Output() onClose = new EventEmitter<void>();

  tags: string = '';
  person: string = '';
  message: string = '';
  success: boolean = false;

  constructor(private metaService: Metadata) { }

  save() {
    if (!this.selectedFile) return;

    this.metaService.update(this.selectedFile.path, this.tags, this.person).subscribe({
      next: (res) => {
        this.message = 'Métadonnées mises à jour avec succès !';
        this.success = true;
        setTimeout(() => this.onClose.emit(), 2000);
      },
      error: (err) => {
        this.message = 'Erreur : ' + err.error?.error || 'Erreur inconnue';
        this.success = false;
      }
    });
  }
}
