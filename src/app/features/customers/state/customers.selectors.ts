import { createSelector } from '@ngrx/store';

import { customersAdapter, customersFeature } from './customers.reducer';

export const {
  selectCustomersState,
  selectLoading: selectCustomersLoading,
  selectError: selectCustomersError,
} = customersFeature;

const { selectAll, selectEntities } = customersAdapter.getSelectors(selectCustomersState);

export const selectAllCustomers = selectAll;
export const selectCustomerEntities = selectEntities;

export const selectCustomerById = (id: string) =>
  createSelector(selectCustomerEntities, (entities) => entities[id]);
