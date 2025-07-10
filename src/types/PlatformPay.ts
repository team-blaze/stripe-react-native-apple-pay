import type { StripeError, PlatformPayError } from './Errors';

export enum ContactField {
  EmailAddress = 'emailAddress',
  Name = 'name',
  PhoneNumber = 'phoneNumber',
  PhoneticName = 'phoneticName',
  PostalAddress = 'postalAddress',
}

export type ApplePayBaseParams = {
  /** ISO 3166-1 alpha-2 country code where the transaction is processed. */
  merchantCountryCode: string;
  /** ISO 4217 alphabetic currency code. */
  currencyCode: string;
  /** The SDK accepts Amex, Mastercard, Visa, and Discover for Apple Pay by default. Set this property to enable other card networks, for example: ["JCB", "barcode", "chinaUnionPay"]. A full list of possible networks can be found at https://developer.apple.com/documentation/passkit/pkpaymentnetwork. */
  additionalEnabledNetworks?: Array<string>;
  /** The list of items that describe a purchase. For example: total, tax, discount, and grand total. */
  cartItems: Array<CartSummaryItem>;
  /** The list of fields that you need for a shipping contact in order to process the transaction. If you include ContactField.PostalAddress in this array, you must implement the PlatformPayButton component's `onShippingContactSelected` callback and call `updatePlatformPaySheet` from there.*/
  requiredShippingAddressFields?: Array<ContactField>;
  /** The list of fields that you need for a billing contact in order to process the transaction. */
  requiredBillingContactFields?: Array<ContactField>;
  /** An array of shipping method objects that describe the supported shipping methods. If provided, you must implement the PlatformPayButton component's `onShippingMethodSelected` callback and call `updatePlatformPaySheet` from there. */
  shippingMethods?: Array<ShippingMethod>;
  /** Set the payment capabilities you support. If set, 3DS is required. */
  merchantCapabilities?: Array<ApplePayMerchantCapability>;
  /** An optional value that indicates how to ship purchased items. Defaults to 'Shipping'.*/
  shippingType?: ApplePayShippingType;
  /** A list of two-letter ISO 3166 country codes for limiting payment to cards from specific countries or regions. */
  supportedCountries?: Array<string>;
};

export type ApplePayConfirmParams = {
  /** A typical request is for a one-time payment. To support different types of payment requests, include a PaymentRequestType. Only supported on iOS 16 and up. */
  request?:
    | RecurringPaymentRequest
    | AutomaticReloadPaymentRequest
    | MultiMerchantRequest;
};

export enum PaymentRequestType {
  Recurring = 'Recurring',
  AutomaticReload = 'AutomaticReload',
  MultiMerchant = 'MultiMerchant',
}

/** Use this for a recurring payment, typically a subscription. */
export type RecurringPaymentRequest = {
  type: PaymentRequestType.Recurring;
  /** A description that you provide of the recurring payment and that Apple Pay displays to the user in the sheet. */
  description: string;
  /** A URL to a web page where the user can update or delete the payment method for the recurring payment. */
  managementUrl: string;
  /** The regular billing cycle for the payment, including start and end dates, an interval, and an interval count. */
  billing: RecurringCartSummaryItem;
  /** Same as the billing property, but use this if the purchase has a trial period. */
  trialBilling?: RecurringCartSummaryItem;
  /** A localized billing agreement that the sheet displays to the user before the user authorizes the payment. */
  billingAgreement?: string;
  /** A URL you provide to receive life-cycle notifications from the Apple Pay servers about the Apple Pay merchant token for the recurring payment.
   * For more information about handling merchant token life-cycle notifications, see Receiving and handling merchant token notifications.
   */
  tokenNotificationURL?: string;
};

/** Use this for an automatic reload or refill payment, such as a store card top-up. */
export type AutomaticReloadPaymentRequest = {
  type: PaymentRequestType.AutomaticReload;
  /** A description that you provide of the recurring payment and that Apple Pay displays to the user in the sheet. */
  description: string;
  /** A URL to a web page where the user can update or delete the payment method for the recurring payment. */
  managementUrl: string;
  /** A short, localized description of the item. */
  label: string;
  /** This is the amount that is automatically applied to the account when the account balance drops below the threshold amount. */
  reloadAmount: string;
  /** The balance an account reaches before you apply the automatic reload amount. */
  thresholdAmount: string;
  /** A localized billing agreement that the sheet displays to the user before the user authorizes the payment. */
  billingAgreement?: string;
  /** A URL you provide to receive life-cycle notifications from the Apple Pay servers about the Apple Pay merchant token for the recurring payment.
   * For more information about handling merchant token life-cycle notifications, see Receiving and handling merchant token notifications.
   */
  tokenNotificationURL?: string;
};

/** Use this to indicate payments for multiple merchants. */
export type MultiMerchantRequest = {
  type: PaymentRequestType.MultiMerchant;
  merchants: Array<{
    /** The Apple Pay merchant identifier. */
    merchantIdentifier: string;
    /** An external identifier for the merchant. */
    externalIdentifier: string;
    /** The merchant’s display name that the Apple Pay server associates with the payment token. */
    merchantName: string;
    /** The merchant’s top-level domain that the Apple Pay server associates with the payment token. */
    merchantDomain?: string;
    /** The amount to authorize for the payment token. */
    amount: string;
  }>;
};

export enum ApplePayMerchantCapability {
  /** Required. This value must be supplied. */
  Supports3DS = 'supports3DS',
  /** Optional. If present, only transactions that are categorized as credit cards are allowed. */
  SupportsCredit = 'supportsCredit',
  /** Optional. If present, only transactions that are categorized as debit cards are allowed. */
  SupportsDebit = 'supportsDebit',
}

/** A type that indicates how to ship purchased items. */
export enum ApplePayShippingType {
  /** Default. */
  Shipping = 'shipping',
  Delivery = 'delivery',
  StorePickup = 'storePickup',
  ServicePickup = 'servicePickup',
}

export interface ConfirmParams {
  /** Defines Apple Pay behavior. iOS only. */
  applePay?: ApplePayBaseParams & ApplePayConfirmParams;
}

export type ConfirmPlatformPayResult =
  | {
      result: string;
      error?: undefined;
    }
  | {
      result?: undefined;
      error: StripeError<PlatformPayError>;
    };

/** iOS only. */
export type CartSummaryItem =
  | DeferredCartSummaryItem
  | ImmediateCartSummaryItem
  | RecurringCartSummaryItem;

/** iOS only. */
export enum PaymentType {
  Deferred = 'Deferred',
  Immediate = 'Immediate',
  Recurring = 'Recurring',
}

/** iOS only. Use this type for a payment that occurs in the future, such as a pre-order. Only available on iOS 15 and up, otherwise falls back to ImmediateCartSummaryItem. */
export type DeferredCartSummaryItem = {
  paymentType: PaymentType.Deferred;
  /** The unix timestamp of the date, in the future, of the payment. Measured in seconds. */
  deferredDate: number;
  label: string;
  amount: string;
};

/** iOS only. Use this type for payments that will occur immediately. */
export type ImmediateCartSummaryItem = {
  paymentType: PaymentType.Immediate;
  /** When creating items for estimates or charges whose final value is not yet known, set this to true. */
  isPending?: boolean;
  label: string;
  amount: string;
};

/** iOS only. Use this type for payments that occur more than once, such as a subscription. Only available on iOS 15 and up, otherwise falls back to ImmediateCartSummaryItem.*/
export type RecurringCartSummaryItem = {
  paymentType: PaymentType.Recurring;
  /** The amount of time – in calendar units such as Day, Month, or Year – that represents a fraction of the total payment interval. For example, if you set the intervalUnit to 'Month' and intervalCount to 3, then the payment interval is three months.*/
  intervalUnit: IntervalUnit;
  /** The number of interval units that make up the total payment interval. For example, if you set the intervalUnit to 'Month' and intervalCount to 3, then the payment interval is three months.*/
  intervalCount: number;
  /** The unix timestamp of the start date. Measured in seconds. */
  startDate?: number;
  /** The unix timestamp of the end date. Measured in seconds. */
  endDate?: number;
  label: string;
  amount: string;
};

/** iOS only. */
export enum IntervalUnit {
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Month = 'month',
  Year = 'year',
}

/** iOS only. */
export type ShippingMethod = {
  /** A short, localized description. */
  label: string;
  /** The cost associated with this shipping option. */
  amount: string;
  /** When creating items for estimates or charges whose final value is not yet known, set this to true. */
  isPending?: boolean;
  /** A unique identifier for the shipping method. */
  identifier: string;
  /** A user-readable description of the shipping method. For example “Ships in 24 hours.” Don't repeat the content of the 'label' property. */
  detail?: string;
  /** The unix timestamp of the start date of the expected range of delivery or shipping dates for a package, or the time range when an item is available for pickup. Measured in seconds. */
  startDate?: number;
  /** The unix timestamp of the end date of the expected range of delivery or shipping dates for a package, or the time range when an item is available for pickup. Measured in seconds. */
  endDate?: number;
};

interface PostalAddress {
  city?: string;
  country?: string;
  postalCode?: string;
  state?: string;
  street?: string;
  isoCountryCode?: string;
  subAdministrativeArea?: string;
  subLocality?: string;
}

interface ContactName {
  familyName?: string;
  namePrefix?: string;
  nameSuffix?: string;
  givenName?: string;
  middleName?: string;
  nickname?: string;
}

export interface ShippingContact {
  emailAddress?: string;
  name: ContactName;
  phoneNumber?: string;
  postalAddress: PostalAddress;
}
