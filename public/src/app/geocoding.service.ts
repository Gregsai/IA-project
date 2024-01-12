// geocoding.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private nominatimBaseUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  geocode(address: string): Observable<any> {
    const params = {
      q: address,
      format: 'json',
      limit: '1',
    };

    return this.http.get(this.nominatimBaseUrl, { params });
  }
}
