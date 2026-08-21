import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { CustomerService } from '../data/customer.service';
import { CustomersApiActions, CustomersPageActions } from './customers.actions';
import { catchError, concatMap, exhaustMap, map, of, switchMap } from 'rxjs';

@Injectable()
export class CustomersEffects {
  private readonly actions$ = inject(Actions);
  private readonly customerService = inject(CustomerService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersPageActions.loadCustomers),
      switchMap(() =>
        this.customerService.getAll().pipe(
          map((customers) => CustomersApiActions.loadCustomersSuccess({ customers })),
          catchError((error) =>
            of(CustomersApiActions.loadCustomersFailure({ error: String(error) })),
          ),
        ),
      ),
    ),
  );

  addCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersPageActions.addCustomer),
      concatMap(({ customer }) =>
        this.customerService.add(customer).pipe(
          map((saved) => CustomersApiActions.addCustomerSuccess({ customer: saved })),
          catchError((error) =>
            of(CustomersApiActions.addCustomerFailure({ error: String(error) })),
          ),
        ),
      ),
    ),
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersPageActions.updateCustomer),
      concatMap(({ customer }) =>
        this.customerService.update(customer).pipe(
          map((updated) => CustomersApiActions.updateCustomerSuccess({ customer: updated })),
          catchError((error) =>
            of(CustomersApiActions.updateCustomerFailure({ error: String(error) })),
          ),
        ),
      ),
    ),
  );

  confirmDeleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersPageActions.deleteCustomer),
      exhaustMap(({ id }) =>
        this.confirmDialog
          .confirm({
            title: 'Delete customer?',
            message: 'Are you sure you want to delete this customer? This cannot be undone.',
          })
          .pipe(
            map((confirmed) =>
              confirmed
                ? CustomersApiActions.deleteCustomerConfirmed({ id })
                : CustomersPageActions.deleteCustomerCancelled(),
            ),
          ),
      ),
    ),
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersApiActions.deleteCustomerConfirmed),
      concatMap(({ id }) =>
        this.customerService.delete(id).pipe(
          map(() => CustomersApiActions.deleteCustomerSuccess({ id })),
          catchError((error) =>
            of(CustomersApiActions.deleteCustomerFailure({ error: String(error) })),
          ),
        ),
      ),
    ),
  );
}
