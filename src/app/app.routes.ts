import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  {
    path: 'customers',
    loadChildren: () => import('./features/customers/customers.routes').then((m) => m.CUSTOMERS_ROUTES),
  },
  {
    path: 'quotes',
    loadChildren: () => import('./features/quotes/quotes.routes').then((m) => m.QUOTES_ROUTES),
  },
  { path: '**', redirectTo: 'customers' },
];
