export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export enum PaymentReleaseStatus {
  HELD = 'held',
  RELEASED = 'released',
  PAID_OUT = 'paid_out'
}

export enum PaymentType {
  BOOKING = 'booking',
  REFUND = 'refund',
  PAYOUT = 'payout'
}

export interface Payment {
  id: string;
  userId: string;
  providerId: string;
  bookingId: string;
  amount: number;
  platformFee: number;
  providerAmount: number;
  taxAmount: number;
  stripeFee: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  releaseStatus: PaymentReleaseStatus;
  releaseDate?: string;
  paidOutDate?: string;
  stripePaymentIntentId?: string;
  stripeRefundId?: string;
  stripeTransferId?: string;
  stripeConnectAccountId?: string;
  refundAmount?: number;
  refundReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: PaymentStatus;
  stripeRefundId?: string;
  createdAt: string;
  updatedAt: string;
}
