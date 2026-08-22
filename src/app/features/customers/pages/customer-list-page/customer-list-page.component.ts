import { AfterViewInit, Component, ViewChild, effect, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CustomersPageActions } from '../../state/customers.actions';
import { Store } from '@ngrx/store';
import { selectAllCustomers, selectCustomersLoading } from '../../state/customers.selectors';
import { TABLE_IMPORTS } from '../../../../shared/material/table.imports';
import { Customer } from '../../../../shared/models/customer.model';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-customer-list-page',
  templateUrl: `./customer-list-page.component.html`,
  styleUrl: './customer-list-page.component.css',
  imports: [...TABLE_IMPORTS, MatButtonModule, MatMenuModule],
})
export class CustomerListPageComponent implements OnInit, AfterViewInit {
  store = inject(Store);
  router = inject(Router);

  @ViewChild(MatSort) sort!: MatSort;

  customers = this.store.selectSignal(selectAllCustomers);
  loading = this.store.selectSignal(selectCustomersLoading);
  dataSource = new MatTableDataSource<Customer>();

  constructor() {
    this.dataSource.sortingDataAccessor = (customer, sortHeaderId) => {
      switch (sortHeaderId) {
        case 'city':
          return customer.addresses[0]?.city ?? '';
        case 'suburb':
          return customer.addresses[0]?.suburb ?? '';
        default:
          return (customer as unknown as Record<string, string>)[sortHeaderId];
      }
    };

    effect(() => (this.dataSource.data = this.customers()));
  }

  readonly displayColumns = ['firstName', 'lastName', 'city', 'suburb', 'actions'];

  ngOnInit(): void {
    this.store.dispatch(CustomersPageActions.loadCustomers());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onViewQuotes(customer: Customer) {
    this.router.navigate(['/quotes'], {
      queryParams: { customerId: customer.id, customerName: `${customer.firstName} ${customer.lastName}` },
    });
  }

  createCustomer() {
    this.router.navigateByUrl('/customers/new');
  }

  onEditCustomer(customer: Customer) {
    this.router.navigate(['/customers', customer.id, 'edit']);
  }

  onDeleteCustomer(customer: Customer) {
    this.store.dispatch(CustomersPageActions.deleteCustomer({ id: customer.id }));
  }
}
