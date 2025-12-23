import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

// --- Domain Models ---
export interface Feature {
  id: number;
  name: string;
  icon: string;
}

export interface Space {
  id: number;
  structureId: number;
  name: string;
  capacity: number;
  featureIds: number[];
}

export interface Structure {
  id: number;
  name: string;
  address: string;
  coords: { lat: number; lng: number };
  description: string;
}

// --- Mock Database ---
@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const features: Feature[] = [
      { id: 1, name: 'Wi-Fi Alta Velocità', icon: 'wifi' },
      { id: 2, name: 'Proiettore 4K', icon: 'videocam' },
      { id: 3, name: 'Aria Condizionata', icon: 'ac_unit' },
      { id: 4, name: 'Accessibilità', icon: 'accessible' }
    ];

    const structures: Structure[] = [
      { id: 1, name: 'Headquarters Roma', address: 'Via dei Fori Imperiali, Roma', coords: { lat: 41.8925, lng: 12.4853 }, description: 'Sede centrale amministrativa.' },
      { id: 2, name: 'Tech Hub Milano', address: 'Piazza Gae Aulenti, Milano', coords: { lat: 45.4842, lng: 9.1868 }, description: 'Centro innovazione e sviluppo.' }
    ];

    const spaces: Space[] = [
      { id: 1, structureId: 1, name: 'Sala Conferenze A', capacity: 50, featureIds: [1, 2] },
      { id: 2, structureId: 1, name: 'Ufficio HR', capacity: 4, featureIds: [1, 3] },
      { id: 3, structureId: 2, name: 'Open Space Dev', capacity: 20, featureIds: [1, 3, 4] }
    ];

    return { features, structures, spaces };
  }
  
  // Override per generare ID automatici
  genId<T extends { id: any }>(collection: T[]): number {
    return collection.length > 0 ? Math.max(...collection.map(t => t.id)) + 1 : 1;
  }
}