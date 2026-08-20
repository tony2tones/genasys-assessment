export type QuoteStatus = 'draft' | 'pending' | 'approved' | 'declined' | 'expired';

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: QuoteStatus;
  createdDate: string;
}
