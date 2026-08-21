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

// TODO: Objective 2 — Material table of customers (TABLE_IMPORTS from
// shared/material/table.imports.ts), local signals for filter text + sort,
// a "Add Customer" button routing to 'new', row actions routing to
// ':id/edit' and to /quotes?customerId=<id>, and a delete action dispatching
// CustomersPageActions.deleteCustomer (confirmation is handled by the effect).
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
    effect(() => (this.dataSource.data = this.customers()));
  }

  readonly displayColumns = ['firstName', 'lastName', 'city', 'actions'];

  ngOnInit(): void {
    this.store.dispatch(CustomersPageActions.loadCustomers());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onViewQuotes(customer: Customer) {
    console.log(customer);
  }

  createCustomer() {
    this.router.navigateByUrl('/customers/new');
  }

  onEditCustomer(customer: Customer) {
    this.router.navigate(['/customers', customer.id, 'edit']);
  }

  onDeleteCustomer(customer: Customer) {
    this.store.dispatch(CustomersPageActions.deleteCustomer({id: customer.id}))
  }
}
