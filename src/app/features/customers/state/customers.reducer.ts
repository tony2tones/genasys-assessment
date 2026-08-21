import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Customer } from '../../../shared/models/customer.model';
import { CustomersApiActions, CustomersPageActions } from './customers.actions';

export interface CustomersState extends EntityState<Customer> {
  loading: boolean;
  error: string | null;
}

export const customersAdapter = createEntityAdapter<Customer>();

const initialState: CustomersState = customersAdapter.getInitialState({
  loading: false,
  error: null,
});

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer(
    initialState,
    on(CustomersPageActions.loadCustomers, (state) => ({ ...state, loading: true, error: null })),
    on(CustomersApiActions.loadCustomersSuccess, (state, { customers }) =>
      customersAdapter.setAll(customers, { ...state, loading: false }),
    ),
    on(CustomersApiActions.loadCustomersFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(CustomersApiActions.addCustomerSuccess, (state, { customer }) =>
      customersAdapter.addOne(customer, state),
    ),
    on(CustomersApiActions.updateCustomerSuccess, (state, { customer }) =>
      customersAdapter.updateOne({ id: customer.id, changes: customer }, state),
    ),
    on(CustomersApiActions.deleteCustomerSuccess, (state, { id }) =>
      customersAdapter.removeOne(id, state),
    ),
  ),
});

export const { name: customersFeatureKey, reducer: customersReducer } = customersFeature;
