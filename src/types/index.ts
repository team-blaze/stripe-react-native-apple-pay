import * as PlatformPay from './PlatformPay';

import * as ApplePayButtonComponent from './components/ApplePayButtonComponent';

export { PlatformPay, ApplePayButtonComponent };

export * from './Errors';

export interface InitialiseParams {
  publishableKey: string;
  merchantIdentifier?: string;
}
