import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Quote } from '../../../shared/models/quote.model';

/** Actions triggered directly by user interaction on a quotes page. */
export const QuotesPageActions = createActionGroup({
  source: 'Quotes Page',
  events: {
    'Load Quotes': emptyProps(),
    'Add Quote': props<{ quote: Quote }>(),
    'Update Quote': props<{ quote: Quote }>(),
    'Delete Quote': props<{ id: string }>(),
    'Delete Quote Cancelled': emptyProps(),
  },
});

/** Actions triggered by the effects layer in response to API/service outcomes. */
export const QuotesApiActions = createActionGroup({
  source: 'Quotes API',
  events: {
    'Load Quotes Success': props<{ quotes: Quote[] }>(),
    'Load Quotes Failure': props<{ error: string }>(),
    'Add Quote Success': props<{ quote: Quote }>(),
    'Add Quote Failure': props<{ error: string }>(),
    'Update Quote Success': props<{ quote: Quote }>(),
    'Update Quote Failure': props<{ error: string }>(),
    'Delete Quote Confirmed': props<{ id: string }>(),
    'Delete Quote Success': props<{ id: string }>(),
    'Delete Quote Failure': props<{ error: string }>(),
  },
});
