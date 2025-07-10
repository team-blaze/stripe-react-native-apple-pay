import NativeStripeSdk from './NativeStripeSdk';
import {
  type PlatformPay,
  type InitialiseParams,
  PlatformPayError,
} from './types';

export function initStripe(params: InitialiseParams): Promise<void> {
  return NativeStripeSdk.initialise(params);
}

export function isPlatformPaySupported(): Promise<boolean> {
  return NativeStripeSdk.isPlatformPaySupported();
}

const APPLE_PAY_NOT_SUPPORTED_MESSAGE =
  'Apple pay is not supported on this device';

export const confirmPlatformPayPayment = async (
  clientSecret: string,
  params: PlatformPay.ConfirmParams
): Promise<PlatformPay.ConfirmPlatformPayResult> => {
  if (!(await NativeStripeSdk.isPlatformPaySupported())) {
    return {
      error: {
        code: PlatformPayError.Canceled,
        message: APPLE_PAY_NOT_SUPPORTED_MESSAGE,
      },
    };
  }
  try {
    const { result, error } = await NativeStripeSdk.confirmPlatformPay(
      clientSecret,
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
};
