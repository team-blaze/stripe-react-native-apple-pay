#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(StripeApplePay, NSObject)

RCT_EXTERN_METHOD(deviceSupportsApplePay:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(pay:(NSString *)publishableKey 
                 clientSecret:(NSString *)clientSecret 
                 merchantIdentifier:(NSString *)merchantIdentifier 
                 params:(NSDictionary *)params
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
