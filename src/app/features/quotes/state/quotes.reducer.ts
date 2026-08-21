import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Quote } from '../../../shared/models/quote.model';
import { QuotesApiActions, QuotesPageActions } from './quotes.actions';

export interface QuotesState extends EntityState<Quote> {
  loading: boolean;
  error: string | null;
}

export const quotesAdapter = createEntityAdapter<Quote>();

const initialState: QuotesState = quotesAdapter.getInitialState({
  loading: false,
  error: null,
});

export const quotesFeature = createFeature({
  name: 'quotes',
  reducer: createReducer(
    initialState,
    on(QuotesPageActions.loadQuotes, (state) => ({ ...state, loading: true, error: null })),
    on(QuotesApiActions.loadQuotesSuccess, (state, { quotes }) =>
      quotesAdapter.setAll(quotes, { ...state, loading: false }),
    ),
    on(QuotesApiActions.loadQuotesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(QuotesApiActions.addQuoteSuccess, (state, { quote }) => quotesAdapter.addOne(quote, state)),
    on(QuotesApiActions.updateQuoteSuccess, (state, { quote }) =>
      quotesAdapter.updateOne({ id: quote.id, changes: quote }, state),
    ),
    on(QuotesApiActions.deleteQuoteSuccess, (state, { id }) => quotesAdapter.removeOne(id, state)),
  ),
});

export const { name: quotesFeatureKey, reducer: quotesReducer } = quotesFeature;
