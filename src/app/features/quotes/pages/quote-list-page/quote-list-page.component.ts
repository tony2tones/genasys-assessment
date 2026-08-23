import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TABLE_IMPORTS } from '../../../../shared/material/table.imports';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectAllQuotes, selectQuotesLoading } from '../../state/quotes.selectors';
import { MatTableDataSource } from '@angular/material/table';
import { Quote } from '../../../../shared/models/quote.model';
import { QuotesPageActions } from '../../state/quotes.actions';
import { MatChipsModule } from '@angular/material/chips';
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QuoteStatus } from '../../../../shared/models/quote.model';

type StatusFilter = QuoteStatus | 'all';

@Component({
  selector: 'app-quote-list-page',
  templateUrl: `./quote-list-page.component.html`,
  styleUrl: './quote-list-page.component.css',
  imports: [
    ...TABLE_IMPORTS,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
})
export class QuoteListPageComponent implements OnInit, AfterViewInit {
  store = inject(Store);
  router = inject(Router);
  customerId = input<string>();
  customerName = input<string>();

  @ViewChild(MatSort) sort!: MatSort;

  filterText = signal('');
  statusFilter = signal<StatusFilter>('all');
  readonly statuses: QuoteStatus[] = ['draft', 'pending', 'approved', 'declined', 'expired'];

  quotes = this.store.selectSignal(selectAllQuotes);
  loading = this.store.selectSignal(selectQuotesLoading);
  dataSource = new MatTableDataSource<Quote>();

  readonly filteredQuotes = computed(() => {
    const customerId = this.customerId();
    const search = this.filterText().trim().toLocaleLowerCase();
    const status = this.statusFilter();

    let result = customerId
      ? this.quotes().filter((quote) => quote.customerId === customerId)
      : this.quotes();

    if (search) {
      result = result.filter((quote) => quote.customerName?.toLowerCase().includes(search));
    }

    if (status !== 'all') {
      result = result.filter((quote) => quote.status === status);
    }

    return result;
  });

  constructor() {
    this.dataSource.sortingDataAccessor = (quote, sortHeaderId) => {
      switch (sortHeaderId) {
        case 'customerName':
          return quote.customerName ?? '';
        case 'amount':
          return quote.amount ?? '';
        default:
          return (quote as unknown as Record<string, string>)[sortHeaderId];
      }
    };
    effect(() => (this.dataSource.data = this.filteredQuotes()));
  }

  readonly displayColumns = ['customerName', 'amount', 'status', 'actions'];

  ngOnInit(): void {
    this.store.dispatch(QuotesPageActions.loadQuotes());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  createQuote() {
    this.router.navigate(['/quotes/new'], {
      queryParams: { customerId: this.customerId(), customerName: this.customerName() },
    });
  }

  updateInsuranceQuote(quote: Quote) {
    this.router.navigate(['/quotes', quote.id, 'edit']);
  }

  onDeleteQuote(quote: Quote) {
    this.store.dispatch(QuotesPageActions.deleteQuote({ id: quote.id }));
  }
}
