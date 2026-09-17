import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, filter, merge, of, retry, switchMap } from 'rxjs';

import { CustomersPageActions } from '../../../customers/state/customers.actions';
import { selectAllCustomers } from '../../../customers/state/customers.selectors';
import { selectQuoteEntities } from '../../state/quotes.selectors';
import { QuotesPageActions } from '../../state/quotes.actions';
import { QuoteService } from '../../data/quote.service';
import { Quote, QuoteStatus } from '../../../../shared/models/quote.model';
import { Router } from '@angular/router';

export type DraftStatus = 'idle' | 'saving' | 'saved' | 'error';

@Component({
  selector: 'app-quote-form-page',
  templateUrl: `./quote-form-page.component.html`,
  imports: [ReactiveFormsModule, MatButtonModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteFormPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly quoteService = inject(QuoteService);

  /** Status of the in-progress autosave; drive a small "Saving.../Saved" indicator in the template. */
  protected readonly draftStatus = signal<DraftStatus>('idle');
  /** Fired by a manual "Save now" button to save immediately, bypassing the debounce. */
  private readonly saveNow$ = new Subject<void>();

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

    this.quoteForm.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      filter(() => this.quoteForm.valid && !!this.quote()),
      switchMap(() => {
        const quote = this.quote();
        if(!quote) {
          return EMPTY;
        }
        this.draftStatus.set('saving');
        const payload: Quote = { ...quote, ...this.quoteForm.getRawValue()}
        return this.quoteService.saveDraft(payload).pipe(
          retry(2),
          catchError(() => {
            this.draftStatus.set('error');
            return EMPTY;
          })
        )
      })
    ).subscribe(() => this.draftStatus.set('saved'))
      
    //
    // Build ONE stream from two sources, merged together:
    //   A) this.quoteForm.valueChanges
    //        - debounce 600ms
    //        - drop it if it's the same as the last value we actually saved
    //          (form values are objects, so === won't work here — you need a
    //          comparator, e.g. JSON.stringify, or compare specific fields)
    //        - only continue if this.quoteForm.valid AND this.quote() exists
    //          (don't autosave a brand new, not-yet-created quote)
    //   B) this.saveNow$ (the manual "Save now" button) — should bypass the
    //        debounce/dedupe entirely and always trigger a save immediately,
    //        as long as the form is currently valid
    //
    
    // Then, on every value from the merged stream:
    //   - set draftStatus signal to 'saving'
    //   - switchMap into this.quoteService.saveDraft({...this.quoteForm.getRawValue(), id: this.quote()!.id, ...})
    //     (switchMap so a newer save cancels a slower in-flight one)
    //   - if the save call errors, retry it up to 2 times, and if it still
    //     fails after that, set draftStatus to 'error' and don't let the
    //     whole outer stream die (the user should be able to keep typing and
    //     trigger another autosave later)
    //   - on success, set draftStatus to 'saved'
    //   - clean up automatically on destroy
  }

  protected onPickCustomer(customerId: string): void {
    this.pickedCustomerId.set(customerId);
    const customer = this.customers().find((c) => c.id === customerId);
    if (customer) {
      this.quoteForm.patchValue({ customerName: `${customer.firstName} ${customer.lastName}` });
    }
  }

  protected saveDraftNow(): void {
    this.saveNow$.next();
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


