import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCustomerEntities } from '../../state/customers.selectors';
import { CustomersPageActions } from '../../state/customers.actions';
import { Address, University } from '../../../../shared/models/customer.model';
import { Router } from '@angular/router';
import {
  EnrichmentResult,
  NationalityEnrichmentComponent,
} from '../../components/nationality-enrichment/nationality-enrichment.component';

@Component({
  selector: 'app-customer-form-page',
  templateUrl: `./customer-form-page.component.html`,
  imports: [ReactiveFormsModule, NationalityEnrichmentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerFormPageComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  router = inject(Router);

  protected readonly id = input<string>();

  private readonly customerEntities = this.store.selectSignal(selectCustomerEntities);
  protected readonly customer = computed(() => {
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

  protected readonly surname = toSignal(this.customerForm.controls.lastName.valueChanges, {
    initialValue: this.customerForm.controls.lastName.value,
  });

  protected readonly enrichedNationality = signal<string | undefined>(undefined);
  protected readonly enrichedUniversity = signal<University | undefined>(undefined);

  constructor() {
    effect(() => {
      const customer = this.customer();
      if (customer) {
        this.customerForm.patchValue(customer);
      }
    });
  }

  protected onEnrichmentChange(result: EnrichmentResult): void {
    this.enrichedNationality.set(result.nationality);
    this.enrichedUniversity.set(result.university);
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const formValue = this.customerForm.getRawValue();
    const currentId = this.id();
    const existingCustomer = this.customer();
    const nationality = this.enrichedNationality() ?? existingCustomer?.nationality;
    const university = this.enrichedUniversity() ?? existingCustomer?.university;

    if (currentId) {
      this.store.dispatch(
        CustomersPageActions.updateCustomer({
          customer: { ...formValue, id: currentId, nationality, university },
        }),
      );
    } else {
      this.store.dispatch(
        CustomersPageActions.addCustomer({
          customer: { ...formValue, id: crypto.randomUUID(), nationality, university },
        }),
      );
    }
    this.router.navigateByUrl('customers');
  }
}
