import * as ApplePay from './ApplePay';

import * as ApplePayButtonComponent from './components/ApplePayButtonComponent';

export { ApplePay, ApplePayButtonComponent };

export * from './Errors';

export interface InitialiseParams {
  publishableKey: string;
  merchantIdentifier?: string;
}
