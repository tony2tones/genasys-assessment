import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer } from '@ngrx/store';

import { Quote } from '../../../shared/models/quote.model';

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

    // TODO: on(QuotesPageActions.loadQuotes, (state) => ({ ...state, loading: true, error: null }))
    // TODO: on(QuotesApiActions.loadQuotesSuccess, (state, { quotes }) =>
    //         quotesAdapter.setAll(quotes, { ...state, loading: false }))
    // TODO: on(QuotesApiActions.loadQuotesFailure, (state, { error }) => ({ ...state, loading: false, error }))
    // TODO: on(QuotesApiActions.addQuoteSuccess, (state, { quote }) =>
    //         quotesAdapter.addOne(quote, state))
    // TODO: on(QuotesApiActions.updateQuoteSuccess, (state, { quote }) =>
    //         quotesAdapter.updateOne({ id: quote.id, changes: quote }, state))
    // TODO: on(QuotesApiActions.deleteQuoteSuccess, (state, { id }) =>
    //         quotesAdapter.removeOne(id, state))
  ),
});

export const { name: quotesFeatureKey, reducer: quotesReducer } = quotesFeature;
