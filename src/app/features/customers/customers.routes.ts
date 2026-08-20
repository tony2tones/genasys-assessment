import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { CustomersEffects } from './state/customers.effects';
import { customersFeature } from './state/customers.reducer';

export const CUSTOMERS_ROUTES: Routes = [
  {
    path: '',
    providers: [provideState(customersFeature), provideEffects(CustomersEffects)],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/customer-list-page/customer-list-page.component').then(
            (m) => m.CustomerListPageComponent,
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/customer-form-page/customer-form-page.component').then(
            (m) => m.CustomerFormPageComponent,
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/customer-form-page/customer-form-page.component').then(
            (m) => m.CustomerFormPageComponent,
          ),
      },
    ],
  },
];
