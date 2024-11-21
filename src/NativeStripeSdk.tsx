import { NativeModules, Platform } from 'react-native';

import type { ApplePay } from './types';

type NativeStripeSdkType = {
  isApplePaySupported(): Promise<boolean>;
  pay(
    publishableKey: String,
    clientSecret: String,
    merchantIdentifier: string,
    params: ApplePay.PresentParams
  ): Promise<string>;
};

const LINKING_ERROR =
  `The package 'react-native-stripe-apple-pay' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const StripeApplePay = NativeModules.StripeApplePay
  ? NativeModules.StripeApplePay
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default StripeApplePay as NativeStripeSdkType;
