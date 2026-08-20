import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { QuotesEffects } from './state/quotes.effects';
import { quotesFeature } from './state/quotes.reducer';

export const QUOTES_ROUTES: Routes = [
  {
    path: '',
    providers: [provideState(quotesFeature), provideEffects(QuotesEffects)],
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
