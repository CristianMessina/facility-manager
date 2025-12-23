import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppFacade } from '../../../facades';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize, of } from 'rxjs';
import { GeocodingService } from '../../../services/geocoding.service';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-structure-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './structure-list.component.html',
  styleUrl: './structure-list.component.scss'
})
export class StructureListComponent {
  facade = inject(AppFacade);
  geoService = inject(GeocodingService);
  fb = inject(FormBuilder);
  ui = inject(UiService);
  
  showForm = false;
  isSearching = false;
  addressSuggestions: any[] = [];

  form = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    description: ['', Validators.required],
    coords: [{ lat: 41.9, lng: 12.5 }] // Default hardcoded per demo
  });

  constructor(private eRef: ElementRef) {
    this.setupAddressSearch();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
  if (!this.eRef.nativeElement.contains(event.target)) {
    this.addressSuggestions = [];
  }
}

  private setupAddressSearch() {
    this.form.get('address')?.valueChanges.pipe(
      // Evitiamo di cercare se il valore è stato appena impostato dalla selezione
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.isSearching = true),
      switchMap(value => {
        if (typeof value === 'string' && value.length > 3) {
          return this.geoService.searchAddress(value).pipe(
            finalize(() => this.isSearching = false)
          );
        }
        this.isSearching = false;
        return of([]);
      })
    ).subscribe(results => {
      this.addressSuggestions = results;
    });
  }

  onAddressFocus() {
    const val = this.form.get('address')?.value;
    if (val && val.length > 3 && this.addressSuggestions.length === 0) {
      this.geoService.searchAddress(val).subscribe(res => this.addressSuggestions = res);
    }
  }

  selectAddress(suggestion: any) {
  const addr = suggestion.address;
  const road = addr.road || addr.pedestrian || addr.cycleway || suggestion.display_name.split(',')[0];
  const province = addr.county || addr.city || addr.town || '';
  const shortAddress = province ? `${road}, ${province}` : road;
  this.form.patchValue({
    address: shortAddress,
    coords: { 
      lat: parseFloat(suggestion.lat), 
      lng: parseFloat(suggestion.lon) 
    }
  }, { emitEvent: false });
  this.addressSuggestions = [];
}

  toggleForm() {
    this.showForm = !this.showForm;
  }

  create() {
    if (this.form.valid) {
      this.facade.addStructure(this.form.value as any).subscribe(() => {
        this.showForm = false;
        this.form.reset();
      });
    }
  }

  delete(id: number) {
    this.ui.showConfirm(
    'Conferma Eliminazione', 
    'Sei sicuro di voler eliminare questa struttura? L\'azione è irreversibile.',
    () => {
      this.ui.setLoading(true);
      this.facade.deleteStructure(id).subscribe({
        next: () => {
          this.ui.setLoading(false);
          this.ui.showSnackbar('Struttura eliminata con successo');
        },
        error: () => {
          this.ui.setLoading(false);
          this.ui.showSnackbar('Errore durante l\'eliminazione', 'error');
        }
      });
    }
  );
  }
}