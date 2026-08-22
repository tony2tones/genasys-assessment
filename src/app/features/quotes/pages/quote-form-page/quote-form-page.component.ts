import { Component, computed, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';

import { selectQuoteEntities } from '../../state/quotes.selectors';
import { QuotesPageActions } from '../../state/quotes.actions';
import { QuoteStatus } from '../../../../shared/models/quote.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-form-page',
  templateUrl: `./quote-form-page.component.html`,
  imports: [ReactiveFormsModule, MatButtonModule],
})
export class QuoteFormPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly id = input<string>();
  // Bound from ?customerId=/?customerName= when arriving via a "quotes for
  // this customer" link (same query-param pattern as QuoteListPageComponent).
  // Both empty when this form is reached without that context — swap for a
  // customer picker here if quotes need to be creatable from a generic entry
  // point too.
  protected readonly customerId = input<string>();
  protected readonly customerName = input<string>();

  readonly statuses: QuoteStatus[] = ['draft', 'pending', 'approved', 'declined', 'expired'];

  private readonly quoteEntities = this.store.selectSignal(selectQuoteEntities);
  private readonly quote = computed(() => {
    const id = this.id();
    return id ? this.quoteEntities()[id] : undefined;
  });

  readonly quoteForm = this.fb.nonNullable.group({
    customerName: [''],
    amount: [0],
    status: this.fb.nonNullable.control<QuoteStatus>('draft'),
  });

  constructor() {
    effect(() => {
      const quote = this.quote();
      if (quote) {
        this.quoteForm.patchValue(quote);
      } else if (this.customerName()) {
        this.quoteForm.patchValue({ customerName: this.customerName() });
      }
    });
  }

  onSubmit(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    const formValues = this.quoteForm.getRawValue();
    const existingQuote = this.quote();

    if (existingQuote) {
      this.store.dispatch(
        QuotesPageActions.updateQuote({
          quote: {
            ...formValues,
            id: existingQuote.id,
            customerId: existingQuote.customerId,
            createdDate: existingQuote.createdDate,
          },
        }),
      );
    } else {
      this.store.dispatch(
        QuotesPageActions.addQuote({
          quote: {
            ...formValues,
            id: crypto.randomUUID(),
            customerId: this.customerId() ?? '',
            createdDate: new Date().toISOString(),
          },
        }),
      );
    }
    this.router.navigateByUrl('/quotes');
  }
}
