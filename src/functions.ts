import NativeStripeSdk from './NativeStripeSdk';
import type { ApplePay, InitialiseParams, StripeError } from './types';
import { ApplePayError } from './types/ApplePay';

export function initStripe(params: InitialiseParams): Promise<void> {
  return NativeStripeSdk.initialise(params);
}

export function isApplePaySupported(): Promise<boolean> {
  return NativeStripeSdk.isApplePaySupported();
}

const APPLE_PAY_NOT_SUPPORTED_MESSAGE =
  'Apple pay is not supported on this device';

export async function presentApplePay(
  params: ApplePay.PresentParams,
  clientSecret?: string
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
    const { result, error } = await NativeStripeSdk.presentApplePay(
      params,
      clientSecret
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

export const confirmApplePayPayment = async (
  clientSecret: string
): Promise<{ error?: StripeError<ApplePayError> }> => {
  if (!(await NativeStripeSdk.isApplePaySupported())) {
    return {
      error: {
        code: ApplePayError.Canceled,
        message: APPLE_PAY_NOT_SUPPORTED_MESSAGE,
      },
    };
  }
  try {
    await NativeStripeSdk.confirmApplePayPayment(clientSecret);
    return {};
  } catch (error: any) {
    return {
      error,
    };
  }
};
