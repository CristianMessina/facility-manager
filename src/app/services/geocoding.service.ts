import { Injectable } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  searchAddress(query: string): Observable<any[]> {
    if (!query || query.length < 3) return of([]);
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
    return from(fetch(url).then(res => res.json())).pipe(
      map(data => Array.isArray(data) ? data : [])
    );
  }
}