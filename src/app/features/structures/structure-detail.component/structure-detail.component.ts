import { Component, inject, OnInit, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { AppFacade } from '../../../facades';

@Component({
  selector: 'app-structure-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './structure-detail.component.html',
  styleUrl: './structure-detail.component.scss'
})

export class StructureDetailComponent implements OnInit, OnDestroy {
  facade = inject(AppFacade);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  
  private map: L.Map | undefined;
  showSpaceForm = false;
  isEditingDescription = false;

  editForm = this.fb.group({
    description: ['']
  });

  spaceForm = this.fb.group({
    name: ['', Validators.required],
    capacity: [10, [Validators.required, Validators.min(1)]],
    featureIds: [[] as number[]]
  });


  constructor() {
    // Effect per inizializzare/aggiornare la mappa quando i dati arrivano
    effect(() => {
      const str = this.facade.selectedStructure();
      if (str) {
        // Timeout minimo per garantire che il div #map sia nel DOM
        setTimeout(() => this.initMap(str.coords), 50); 
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.facade.selectStructure(Number(params['id']));
      }
    });
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap(coords: {lat: number, lng: number}) {
    if (this.map) { 
      this.map.remove(); 
    }
    
    this.map = L.map('map', {
      center: [coords.lat, coords.lng],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    L.marker([coords.lat, coords.lng]).addTo(this.map);
  }

  getFeatureName(id: number): string {
    const feat = this.facade.features().find(f => f.id == id);
    return feat ? feat.name : 'Unknown';
  }

  toggleSpaceForm() { 
    this.showSpaceForm = !this.showSpaceForm; 
  }

  saveDescription() {
    const str = this.facade.selectedStructure();
    if (str && this.editForm.valid) {
      const updated = { ...str, description: this.editForm.value.description || '' };  
      this.facade.updateStructure(updated).subscribe(() => {
        this.isEditingDescription = false;
      });
    }
  }


  addSpace(structureId: number) {
    if (this.spaceForm.valid) {
      const newSpace = { ...this.spaceForm.value, structureId } as any;
      this.facade.addSpace(newSpace).subscribe(() => {
        this.showSpaceForm = false;
        this.spaceForm.reset({ capacity: 10, featureIds: [] });
      });
    }
  }

  deleteSpace(id: number) {
    if(confirm('Rimuovere questo spazio?')) {
      this.facade.deleteSpace(id).subscribe();
    }
  }

  toggleEdit() {
    this.isEditingDescription = !this.isEditingDescription;
    if (this.isEditingDescription) {
      this.editForm.patchValue({ description: this.facade.selectedStructure()?.description });
    }
  }

  goBack() {
    window.history.back();
  }
}