export interface Address {
  street: string;
  city: string;
  suburb: string;
  postalCode: string;
}

export interface University {
  name: string;
  website: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  /** Confirmed by the user in the Task 5 enrichment panel. */
  nationality?: string;
  /** Selected via the Task 5 university search-as-you-type. */
  university?: University;
}
