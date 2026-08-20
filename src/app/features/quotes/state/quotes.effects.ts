import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { QuoteService } from '../data/quote.service';

@Injectable()
export class QuotesEffects {
  private readonly actions$ = inject(Actions);
  private readonly quoteService = inject(QuoteService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  // TODO: loadQuotes$ = createEffect(() => this.actions$.pipe(
  //   ofType(QuotesPageActions.loadQuotes),
  //   switchMap(() => this.quoteService.getAll().pipe(
  //     map((quotes) => QuotesApiActions.loadQuotesSuccess({ quotes })),
  //     catchError((error) => of(QuotesApiActions.loadQuotesFailure({ error: String(error) }))),
  //   )),
  // ));

  // TODO: addQuote$ / updateQuote$ = createEffect(() => this.actions$.pipe(
  //   ofType(QuotesPageActions.addQuote / updateQuote),
  //   concatMap(({ quote }) => this.quoteService.add/update(quote).pipe(
  //     map((saved) => QuotesApiActions.add/updateQuoteSuccess({ quote: saved })),
  //     catchError((error) => of(QuotesApiActions.add/updateQuoteFailure({ error: String(error) }))),
  //   )),
  // ));

  // TODO: confirmDeleteQuote$ = createEffect(() => this.actions$.pipe(
  //   ofType(QuotesPageActions.deleteQuote),
  //   exhaustMap(({ id }) => this.confirmDialog.confirm({
  //     title: 'Delete quote',
  //     message: 'Are you sure you want to delete this quote? This cannot be undone.',
  //   }).pipe(
  //     map((confirmed) => confirmed
  //       ? QuotesApiActions.deleteQuoteConfirmed({ id })
  //       : QuotesPageActions.deleteQuoteCancelled()),
  //   )),
  // ));

  // TODO: deleteQuote$ = createEffect(() => this.actions$.pipe(
  //   ofType(QuotesApiActions.deleteQuoteConfirmed),
  //   concatMap(({ id }) => this.quoteService.delete(id).pipe(
  //     map(() => QuotesApiActions.deleteQuoteSuccess({ id })),
  //     catchError((error) => of(QuotesApiActions.deleteQuoteFailure({ error: String(error) }))),
  //   )),
  // ));
}
