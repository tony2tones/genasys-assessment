import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';

import { Country, NationalityPrediction } from '../../shared/models/country.model';
import { University } from '../../shared/models/customer.model';

interface NationalizeResponse {
  country: { country_id: string; probability: number }[];
}

interface HipolabsUniversity {
  name: string;
  web_pages: string[];
}

/**
 * Wraps the three external APIs used by the Task 5 enrichment panel:
 * Nationalize (surname -> country predictions), countries.dev (full country
 * list, fetched once and cached), and hipolabs (university search).
 */
@Injectable({ providedIn: 'root' })
export class EnrichmentService {
  private readonly http = inject(HttpClient);
  private countries$?: Observable<Country[]>;

  predictNationality(surname: string): Observable<NationalityPrediction[]> {
    return this.http
      .get<NationalizeResponse>('https://api.nationalize.io', { params: { name: surname } })
      .pipe(
        map((response) =>
          (response.country ?? []).map((c) => ({
            countryCode: c.country_id,
            probability: c.probability,
          })),
        ),
        // Empty predictions and failures (incl. 429 rate-limiting) both just
        // mean "no predictions available" from the caller's point of view.
        catchError(() => of([])),
      );
  }

  getCountries(): Observable<Country[]> {
    // Fetched once and cached for the app's lifetime, per the brief — this
    // list is stable, so repeated calls reuse the same in-flight/completed
    // request instead of re-fetching.
    this.countries$ ??= this.http
      .get<Country[]>('https://countries.dev/countries', {
        params: { fields: 'name,flag,flags,alpha2Code' },
      })
      .pipe(
        catchError(() => of([])),
        shareReplay(1),
      );
    return this.countries$;
  }

  searchUniversities(countryName: string, query: string): Observable<University[]> {
    return this.http
      .get<HipolabsUniversity[]>('http://universities.hipolabs.com/search', {
        params: { country: countryName, name: query },
      })
      .pipe(
        map((results) => results.map((u) => ({ name: u.name, website: u.web_pages[0] ?? '' }))),
        catchError(() => of([])),
      );
  }
}
