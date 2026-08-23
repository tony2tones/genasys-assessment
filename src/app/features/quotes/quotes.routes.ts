import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { CustomersEffects } from '../customers/state/customers.effects';
import { customersFeature } from '../customers/state/customers.reducer';
import { QuotesEffects } from './state/quotes.effects';
import { quotesFeature } from './state/quotes.reducer';

export const QUOTES_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(quotesFeature),
      provideEffects(QuotesEffects),
      // Also registered here (not just under /customers) so the quote form's
      // customer picker has data available even if /customers was never
      // visited this session. Re-registering the same feature name from a
      // second lazy route entry point is a supported NgRx pattern.
      provideState(customersFeature),
      provideEffects(CustomersEffects),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/quote-list-page/quote-list-page.component').then(
            (m) => m.QuoteListPageComponent,
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/quote-form-page/quote-form-page.component').then(
            (m) => m.QuoteFormPageComponent,
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/quote-form-page/quote-form-page.component').then(
            (m) => m.QuoteFormPageComponent,
          ),
      },
    ],
  },
];
