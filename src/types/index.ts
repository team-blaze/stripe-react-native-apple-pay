import * as ApplePay from './ApplePay';
import * as Errors from './Errors';

import * as ApplePayButtonComponent from './components/ApplePayButtonComponent';

export { ApplePay, ApplePayButtonComponent, Errors };

export interface InitialiseParams {
  publishableKey: string;
  merchantIdentifier?: string;
}
