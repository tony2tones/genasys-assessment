import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { QuoteService } from '../data/quote.service';
import { QuotesApiActions, QuotesPageActions } from './quotes.actions';
import { catchError, concatMap, exhaustMap, map, of, switchMap } from 'rxjs';

@Injectable()
export class QuotesEffects {
  private readonly actions$ = inject(Actions);
  private readonly quoteService = inject(QuoteService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  loadQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuotesPageActions.loadQuotes),
      switchMap(() =>
        this.quoteService.getAll().pipe(
          map((quotes) => QuotesApiActions.loadQuotesSuccess({ quotes })),
          catchError((error) => of(QuotesApiActions.loadQuotesFailure({ error: String(error) }))),
        ),
      ),
    ),
  );

  addQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuotesPageActions.addQuote),
      concatMap(({ quote }) =>
        this.quoteService.add(quote).pipe(
          map((saved) => QuotesApiActions.addQuoteSuccess({ quote: saved })),
          catchError((error) => of(QuotesApiActions.addQuoteFailure({ error: String(error) }))),
        ),
      ),
    ),
  );

  updateQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuotesPageActions.updateQuote),
      concatMap(({ quote }) =>
        this.quoteService.update(quote).pipe(
          map((saved) => QuotesApiActions.updateQuoteSuccess({ quote: saved })),
          catchError((error) =>
            of(QuotesApiActions.updateQuoteFailure({ error: String(error) })),
          ),
        ),
      ),
    ),
  );

  confirmDeleteQuote$ = createEffect(() => 
    this.actions$.pipe(
    ofType(QuotesPageActions.deleteQuote),
    exhaustMap(({id}) => 
      this.confirmDialog
      .confirm({
        title: 'Delete quote?',
        message: 'Are you sure you want to delete this quote? This cannot be undone.',
    })
    .pipe(
      map((confirmed) => 
        confirmed 
      ? QuotesApiActions.deleteQuoteConfirmed({id}) 
      : QuotesPageActions.deleteQuoteCancelled())
    ),
    )))


  deleteQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuotesApiActions.deleteQuoteConfirmed),
      concatMap(({ id }) =>
        this.quoteService.delete(id).pipe(
          map(() => QuotesApiActions.deleteQuoteSuccess({ id })),
          catchError((error) =>
            of(QuotesApiActions.deleteQuoteFailure({ error: String(error) })),
          ),
        ),
      ),
    ),
  );
}
