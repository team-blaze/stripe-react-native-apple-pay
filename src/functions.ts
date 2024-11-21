import NativeStripeSdk from './NativeStripeSdk';
import type { ApplePay } from './types';

export function isApplePaySupported(): Promise<boolean> {
  return NativeStripeSdk.isApplePaySupported();
}

export function pay(
  publishableKey: String,
  clientSecret: String,
  merchantIdentifier: string,
  params: ApplePay.PresentParams
): Promise<string> {
  return NativeStripeSdk.pay(
    publishableKey,
    clientSecret,
    merchantIdentifier,
    params
  );
}
