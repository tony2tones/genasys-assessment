import { Component, computed, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCustomerEntities } from '../../state/customers.selectors';
import { CustomersPageActions } from '../../state/customers.actions';
import { Address } from '../../../../shared/models/customer.model';
import { Router } from '@angular/router';

// TODO: Task 5 (AI-assisted) — enrichment panel here: debounced surname ->
// Nationalize API -> country confirm/override -> university search-as-you-type.
@Component({
  selector: 'app-customer-form-page',
  templateUrl: `./customer-form-page.component.html`,
  imports: [ReactiveFormsModule],
})
export class CustomerFormPageComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  router = inject(Router);

  protected readonly id = input<string>();

  private readonly customerEntities = this.store.selectSignal(selectCustomerEntities);
  private readonly customer = computed(() => {
    const id = this.id();
    return id ? this.customerEntities()[id] : undefined;
  });

  private createAddressGroup(address?: Address) {
    return this.fb.nonNullable.group({
      street: [address?.street ?? '', Validators.required],
      city: [address?.city ?? '', Validators.required],
      suburb: [address?.suburb ?? '', Validators.required],
      postalCode: [address?.postalCode ?? '', Validators.required],
    });
  }

  readonly customerForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    addresses: this.fb.array([this.createAddressGroup()]),
  });

  protected get addresses() {
    return this.customerForm.controls.addresses;
  }

  constructor() {
    effect(() => {
      const customer = this.customer();
      if (customer) {
        this.customerForm.patchValue(customer);
      }
    });
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const formValue = this.customerForm.getRawValue();
    const currentId = this.id();

    if (currentId) {
      this.store.dispatch(
        CustomersPageActions.updateCustomer({ customer: { ...formValue, id: currentId } }),
      );
    } else {
      this.store.dispatch(
        CustomersPageActions.addCustomer({ customer: { ...formValue, id: crypto.randomUUID() } }),
      );
    }
    this.router.navigateByUrl('customers');
  }
}
