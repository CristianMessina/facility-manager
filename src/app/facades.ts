import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Structure, Space, Feature } from './core';
import { finalize, tap } from 'rxjs';
import { UiService } from './services/ui.service';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  private http = inject(HttpClient);
  private ui = inject(UiService);
  
  // --- STATE (Signals) ---
  private _structures = signal<Structure[]>([]);
  private _spaces = signal<Space[]>([]);
  private _features = signal<Feature[]>([]);
  private _selectedStructureId = signal<number | null>(null);
  private _loading = signal<boolean>(false);

  // --- SELECTORS ---
  readonly structures = this._structures.asReadonly();
  readonly features = this._features.asReadonly();
  readonly loading = this._loading.asReadonly();
  
  // Computed: Spazi filtrati per la struttura selezionata
  readonly currentStructureSpaces = computed(() => 
    this._spaces().filter(s => s.structureId === this._selectedStructureId())
  );

  // Computed: Struttura selezionata
  readonly selectedStructure = computed(() => 
    this._structures().find(s => s.id === this._selectedStructureId())
  );

  // --- ACTIONS ---
  
  // Caricamento Iniziale
  loadAllData() {
    this._loading.set(true);
    // In app reale useremmo forkJoin, qui semplifichiamo
    this.http.get<Feature[]>('api/features').subscribe(f => this._features.set(f));
    this.http.get<Space[]>('api/spaces').subscribe(s => this._spaces.set(s));
    this.http.get<Structure[]>('api/structures').subscribe(s => {
      this._structures.set(s);
      this._loading.set(false);
    });
  }

  selectStructure(id: number) {
    this._selectedStructureId.set(id);
  }

  // CRUD Struttura
  addStructure(s: Partial<Structure>) {
  this.ui.setLoading(true);
  return this.http.post<Structure>('api/structures', s).pipe(
    tap(newS => {
      this._structures.update(list => [...list, newS]);
      this.ui.showSnackbar('Struttura aggiunta correttamente');
    }),
    finalize(() => this.ui.setLoading(false))
  );
}

  updateStructure(str: Structure) {
  return this.http.put<Structure>(`api/structures/${str.id}`, str).pipe(
    tap(() => {
      // Usiamo 'str' direttamente invece dell'argomento della callback
      this._structures.update(list => 
        list.map(s => s.id === str.id ? { ...str } : s)
      );
      
      // Se la struttura aggiornata è quella attualmente selezionata, aggiorna anche il segnale di selezione
      if (this._selectedStructureId() === str.id) {
        // Forziamo l'aggiornamento dello stato locale per riflettere i cambiamenti nel dettaglio
        this._selectedStructureId.set(str.id); 
      }
    })
  );
}

  deleteStructure(id: number) {
    return this.http.delete(`api/structures/${id}`).pipe(
      tap(() => {
        this._structures.update(list => list.filter(s => s.id !== id));
        // Elimina a cascata gli spazi locali (mock)
        this._spaces.update(list => list.filter(s => s.structureId !== id));
      })
    );
  }

  // CRUD Spazi
  addSpace(s: Partial<Space>) {
    return this.http.post<Space>('api/spaces', s).pipe(
      tap(newS => this._spaces.update(list => [...list, newS]))
    );
  }

  deleteSpace(id: number) {
    return this.http.delete(`api/spaces/${id}`).pipe(
      tap(() => this._spaces.update(list => list.filter(s => s.id !== id)))
    );
  }

  // --- FEATURES (SERVIZI) CRUD ---

  addFeature(f: Partial<Feature>) {
    return this.http.post<Feature>('api/features', f).pipe(
      tap(newF => this._features.update(list => [...list, newF]))
    );
  }

  updateFeature(f: Feature) {
    return this.http.put<void>(`api/features/${f.id}`, f).pipe(
      tap(() => {
        this._features.update(list => list.map(item => item.id === f.id ? f : item));
      })
    );
  }

  deleteFeature(id: number) {
    return this.http.delete(`api/features/${id}`).pipe(
      tap(() => {
        // 1. Rimuovi dalla lista globale
        this._features.update(list => list.filter(f => f.id !== id));
        
        // 2. CLEANUP: Rimuovi l'ID della feature dagli spazi che la usavano
        // (In un backend reale lo farebbe il DB con foreign keys, qui lo simuliamo)
        this._spaces.update(spaces => 
          spaces.map(s => ({
            ...s,
            featureIds: s.featureIds.filter(fid => fid !== id)
          }))
        );
      })
    );
  }
}