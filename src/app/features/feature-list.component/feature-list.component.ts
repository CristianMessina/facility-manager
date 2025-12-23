import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppFacade } from '../../facades';
import { Feature } from '../../core';

@Component({
  selector: 'app-feature-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.scss'
})
export class FeatureListComponent {
  facade = inject(AppFacade);
  fb = inject(FormBuilder);

  // Stato locale per la UI
  isEditing = signal<number | null>(null);
  showIconSelector = false;

  // Lista di icone Material disponibili per la selezione
  availableIcons = [
    'wifi', 'ac_unit', 'videocam', 'accessible', 'local_parking', 
    'coffee', 'restaurant', 'pool', 'fitness_center', 'elevator',
    'meeting_room', 'print', 'security', 'lightbulb', 'network_check'
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    icon: ['wifi', Validators.required] // Default icon
  });

  // --- CREAZIONE ---
  create() {
    if (this.form.valid) {
      this.facade.addFeature(this.form.value as any).subscribe(() => {
        this.form.reset({ icon: 'wifi' }); // Reset mantenendo un'icona valida
        this.showIconSelector = false;
      });
    }
  }

  // --- MODIFICA ---
  startEdit(feature: Feature) {
    this.isEditing.set(feature.id);
    this.form.patchValue(feature);
    this.showIconSelector = false; // Reset stato selettore
  }

  cancelEdit() {
    this.isEditing.set(null);
    this.form.reset({ icon: 'wifi' });
  }

  saveEdit(id: number) {
    if (this.form.valid) {
      const updatedFeature: Feature = { 
        id, 
        name: this.form.value.name!, 
        icon: this.form.value.icon! 
      };
      
      this.facade.updateFeature(updatedFeature).subscribe(() => {
        this.isEditing.set(null);
        this.form.reset({ icon: 'wifi' });
      });
    }
  }

  // --- CANCELLAZIONE ---
  delete(id: number) {
    if (confirm('Eliminando questo servizio verrà rimosso anche da tutti gli spazi che lo usano. Procedere?')) {
      this.facade.deleteFeature(id).subscribe();
    }
  }

  selectIcon(iconName: string) {
    this.form.patchValue({ icon: iconName });
    this.showIconSelector = false;
  }
}