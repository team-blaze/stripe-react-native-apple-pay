export type ErrorType =
  | 'api_connection_error'
  | 'api_error'
  | 'authentication_error'
  | 'card_error'
  | 'idempotency_error'
  | 'invalid_request_error'
  | 'rate_limit_error';

export interface StripeError<T> {
  code: T;
  message: string;
  localizedMessage?: string;
  declineCode?: string;
  stripeErrorCode?: string;
  type?: ErrorType;
}
