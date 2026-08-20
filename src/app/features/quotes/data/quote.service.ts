import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Quote } from '../../../shared/models/quote.model';
import { MOCK_QUOTES } from './quote.mock';

const SIMULATED_LATENCY_MS = 300;

/**
 * In-memory stand-in for a real backend. Returns Observables (with a small
 * delay) so the NgRx effects that call this have something genuinely async
 * to orchestrate, matching how a real HTTP-backed service would behave.
 */
@Injectable({ providedIn: 'root' })
export class QuoteService {
  private quotes: Quote[] = [...MOCK_QUOTES];

  getAll(): Observable<Quote[]> {
    return of(this.quotes).pipe(delay(SIMULATED_LATENCY_MS));
  }

  add(quote: Quote): Observable<Quote> {
    this.quotes = [...this.quotes, quote];
    return of(quote).pipe(delay(SIMULATED_LATENCY_MS));
  }

  update(quote: Quote): Observable<Quote> {
    this.quotes = this.quotes.map((existing) => (existing.id === quote.id ? quote : existing));
    return of(quote).pipe(delay(SIMULATED_LATENCY_MS));
  }

  delete(id: string): Observable<string> {
    this.quotes = this.quotes.filter((quote) => quote.id !== id);
    return of(id).pipe(delay(SIMULATED_LATENCY_MS));
  }
}
