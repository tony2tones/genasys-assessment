import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Customer } from '../../../shared/models/customer.model';
import { MOCK_CUSTOMERS } from './customer.mock';

const SIMULATED_LATENCY_MS = 300;

/**
 * In-memory stand-in for a real backend. Returns Observables (with a small
 * delay) so the NgRx effects that call this have something genuinely async
 * to orchestrate, matching how a real HTTP-backed service would behave.
 */
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private customers: Customer[] = [...MOCK_CUSTOMERS];

  getAll(): Observable<Customer[]> {
    return of(this.customers).pipe(delay(SIMULATED_LATENCY_MS));
  }

  add(customer: Customer): Observable<Customer> {
    this.customers = [...this.customers, customer];
    return of(customer).pipe(delay(SIMULATED_LATENCY_MS));
  }

  update(customer: Customer): Observable<Customer> {
    this.customers = this.customers.map((existing) =>
      existing.id === customer.id ? customer : existing,
    );
    return of(customer).pipe(delay(SIMULATED_LATENCY_MS));
  }

  delete(id: string): Observable<string> {
    this.customers = this.customers.filter((customer) => customer.id !== id);
    return of(id).pipe(delay(SIMULATED_LATENCY_MS));
  }
}
