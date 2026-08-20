import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { CustomerService } from '../data/customer.service';

@Injectable()
export class CustomersEffects {
  private readonly actions$ = inject(Actions);
  private readonly customerService = inject(CustomerService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  // TODO: loadCustomers$ = createEffect(() => this.actions$.pipe(
  //   ofType(CustomersPageActions.loadCustomers),
  //   switchMap(() => this.customerService.getAll().pipe(
  //     map((customers) => CustomersApiActions.loadCustomersSuccess({ customers })),
  //     catchError((error) => of(CustomersApiActions.loadCustomersFailure({ error: String(error) }))),
  //   )),
  // ));

  // TODO: addCustomer$ / updateCustomer$ = createEffect(() => this.actions$.pipe(
  //   ofType(CustomersPageActions.addCustomer / updateCustomer),
  //   concatMap(({ customer }) => this.customerService.add/update(customer).pipe(
  //     map((saved) => CustomersApiActions.add/updateCustomerSuccess({ customer: saved })),
  //     catchError((error) => of(CustomersApiActions.add/updateCustomerFailure({ error: String(error) }))),
  //   )),
  // ));

  // TODO: confirmDeleteCustomer$ = createEffect(() => this.actions$.pipe(
  //   ofType(CustomersPageActions.deleteCustomer),
  //   exhaustMap(({ id }) => this.confirmDialog.confirm({
  //     title: 'Delete customer',
  //     message: 'Are you sure you want to delete this customer? This cannot be undone.',
  //   }).pipe(
  //     map((confirmed) => confirmed
  //       ? CustomersApiActions.deleteCustomerConfirmed({ id })
  //       : CustomersPageActions.deleteCustomerCancelled()),
  //   )),
  // ));

  // TODO: deleteCustomer$ = createEffect(() => this.actions$.pipe(
  //   ofType(CustomersApiActions.deleteCustomerConfirmed),
  //   concatMap(({ id }) => this.customerService.delete(id).pipe(
  //     map(() => CustomersApiActions.deleteCustomerSuccess({ id })),
  //     catchError((error) => of(CustomersApiActions.deleteCustomerFailure({ error: String(error) }))),
  //   )),
  // ));
}
