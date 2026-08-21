import { Customer } from '../../../shared/models/customer.model';
// Customer/Address shapes in shared/models/customer.model.ts). A mix of
// surnames from different countries is useful later for testing the Task 5
// nationality-prediction panel.
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    firstName: 'Thabo',
    lastName: 'Mokoena',
    addresses: [
      { street: '12 Church Street', city: 'Cape Town', suburb: 'Gardens', postalCode: '8001' },
    ],
  },
  {
    id: '2',
    firstName: 'Anja',
    lastName: 'van der Merwe',
    addresses: [
      {
        street: '45 Dorp Street',
        city: 'Stellenbosch',
        suburb: 'Mostertsdrift',
        postalCode: '7600',
      },
      { street: '8 Kloof Road', city: 'Cape Town', suburb: 'Camps Bay', postalCode: '8005' },
    ],
  },
  {
    id: '3',
    firstName: 'James',
    lastName: 'Smith',
    addresses: [
      { street: '210 Oxford Road', city: 'Johannesburg', suburb: 'Rosebank', postalCode: '2196' },
    ],
  },
  {
    id: '4',
    firstName: 'Mai',
    lastName: 'Nguyen',
    addresses: [
      { street: '67 Florida Road', city: 'Durban', suburb: 'Morningside', postalCode: '4001' },
    ],
  },
  {
    id: '5',
    firstName: 'Lukas',
    lastName: 'Schmidt',
    addresses: [
      { street: '19 Lynnwood Road', city: 'Pretoria', suburb: 'Brooklyn', postalCode: '0181' },
    ],
  },
  {
    id: '6',
    firstName: 'Nomvula',
    lastName: 'Dlamini',
    addresses: [
      { street: '3 Musgrave Road', city: 'Durban', suburb: 'Musgrave', postalCode: '4001' },
      {
        street: '77 Main Reef Road',
        city: 'Johannesburg',
        suburb: 'Fordsburg',
        postalCode: '2033',
      },
    ],
  },
  {
    id: '7',
    firstName: 'Ewa',
    lastName: 'Kowalski',
    addresses: [
      { street: '5 Bree Street', city: 'Cape Town', suburb: 'City Centre', postalCode: '8000' },
    ],
  },
  {
    id: '8',
    firstName: 'Rafael',
    lastName: 'Silva',
    addresses: [
      { street: '14 Marine Parade', city: 'Durban', suburb: 'Point', postalCode: '4001' },
    ],
  },
];
