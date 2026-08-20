import { createSelector } from '@ngrx/store';

import { quotesAdapter, quotesFeature } from './quotes.reducer';

export const {
  selectQuotesState,
  selectLoading: selectQuotesLoading,
  selectError: selectQuotesError,
} = quotesFeature;

const { selectAll, selectEntities } = quotesAdapter.getSelectors(selectQuotesState);

export const selectAllQuotes = selectAll;
export const selectQuoteEntities = selectEntities;

export const selectQuoteById = (id: string) =>
  createSelector(selectQuoteEntities, (entities) => entities[id]);

export const selectQuotesByCustomerId = (customerId: string) =>
  createSelector(selectAllQuotes, (quotes) => quotes.filter((quote) => quote.customerId === customerId));
