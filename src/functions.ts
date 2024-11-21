import NativeStripeSdk from './NativeStripeSdk';
import type { ApplePay } from './types';
import { ApplePayError } from './types/ApplePay';

export function isApplePaySupported(): Promise<boolean> {
  return NativeStripeSdk.isApplePaySupported();
}

const APPLE_PAY_NOT_SUPPORTED_MESSAGE =
  'Apple pay is not supported on this device';

export async function pay(
  publishableKey: String,
  clientSecret: String,
  merchantIdentifier: string,
  params: ApplePay.PresentParams
): Promise<ApplePay.ApplePayResult> {
  if (!(await NativeStripeSdk.isApplePaySupported())) {
    return {
      error: {
        code: ApplePayError.Canceled,
        message: APPLE_PAY_NOT_SUPPORTED_MESSAGE,
      },
    };
  }

  try {
    const { result, error } = await NativeStripeSdk.pay(
      publishableKey,
      clientSecret,
      merchantIdentifier,
      params
    );
    if (error) {
      return {
        error,
      };
    }
    return { result };
  } catch (error: any) {
    return {
      error,
    };
  }
}
