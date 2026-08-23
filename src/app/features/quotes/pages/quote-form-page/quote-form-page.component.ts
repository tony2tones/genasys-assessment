import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { CustomersPageActions } from '../../../customers/state/customers.actions';
import { selectAllCustomers } from '../../../customers/state/customers.selectors';
import { selectQuoteEntities } from '../../state/quotes.selectors';
import { QuotesPageActions } from '../../state/quotes.actions';
import { QuoteStatus } from '../../../../shared/models/quote.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-form-page',
  templateUrl: `./quote-form-page.component.html`,
  imports: [ReactiveFormsModule, MatButtonModule, MatSelectModule],
})
export class QuoteFormPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly id = input<string>();
  // Bound from ?customerId=/?customerName= when arriving via a "quotes for
  // this customer" link (same query-param pattern as QuoteListPageComponent).
  // Both empty when this form is reached without that context, in which case
  // the customer picker below is shown instead.
  protected readonly customerId = input<string>();
  protected readonly customerName = input<string>();

  readonly statuses: QuoteStatus[] = ['draft', 'pending', 'approved', 'declined', 'expired'];

  private readonly quoteEntities = this.store.selectSignal(selectQuoteEntities);
  private readonly quote = computed(() => {
    const id = this.id();
    return id ? this.quoteEntities()[id] : undefined;
  });

  protected readonly customers = this.store.selectSignal(selectAllCustomers);
  protected readonly showCustomerPicker = computed(() => !this.id() && !this.customerId());
  protected readonly pickedCustomerId = signal<string | undefined>(undefined);

  readonly quoteForm = this.fb.nonNullable.group({
    customerName: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    status: this.fb.nonNullable.control<QuoteStatus>('draft', Validators.required),
  });

  constructor() {
    this.store.dispatch(CustomersPageActions.loadCustomers());

    effect(() => {
      const quote = this.quote();
      if (quote) {
        this.quoteForm.patchValue(quote);
      } else if (this.customerName()) {
        this.quoteForm.patchValue({ customerName: this.customerName() });
      }
    });
  }

  protected onPickCustomer(customerId: string): void {
    this.pickedCustomerId.set(customerId);
    const customer = this.customers().find((c) => c.id === customerId);
    if (customer) {
      this.quoteForm.patchValue({ customerName: `${customer.firstName} ${customer.lastName}` });
    }
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
            customerId: this.customerId() ?? this.pickedCustomerId() ?? '',
            createdDate: new Date().toISOString(),
          },
        }),
      );
    }
    this.router.navigateByUrl('/quotes');
  }
}
