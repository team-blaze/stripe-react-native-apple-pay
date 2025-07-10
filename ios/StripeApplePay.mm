#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(StripeApplePay, NSObject)

RCT_EXTERN_METHOD(
                  initialise:(NSDictionary *)params
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(
                  isPlatformPaySupported:(RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(
                  confirmPlatformPay:(NSString *)clientSecret
                  params:(NSDictionary *)params
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
