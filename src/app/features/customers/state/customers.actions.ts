import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Customer } from '../../../shared/models/customer.model';

/** Actions triggered directly by user interaction on a customers page. */
export const CustomersPageActions = createActionGroup({
  source: 'Customers Page',
  events: {
    'Load Customers': emptyProps(),
    'Add Customer': props<{ customer: Customer }>(),
    'Update Customer': props<{ customer: Customer }>(),
    'Delete Customer': props<{ id: string }>(),
    'Delete Customer Cancelled': emptyProps(),
  },
});

/** Actions triggered by the effects layer in response to API/service outcomes. */
export const CustomersApiActions = createActionGroup({
  source: 'Customers API',
  events: {
    'Load Customers Success': props<{ customers: Customer[] }>(),
    'Load Customers Failure': props<{ error: string }>(),
    'Add Customer Success': props<{ customer: Customer }>(),
    'Add Customer Failure': props<{ error: string }>(),
    'Update Customer Success': props<{ customer: Customer }>(),
    'Update Customer Failure': props<{ error: string }>(),
    'Delete Customer Confirmed': props<{ id: string }>(),
    'Delete Customer Success': props<{ id: string }>(),
    'Delete Customer Failure': props<{ error: string }>(),
  },
});
