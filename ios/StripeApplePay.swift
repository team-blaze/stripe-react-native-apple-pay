import Foundation
import PassKit
import StripeApplePay

@objc(StripeApplePay)
class StripeApplePay: NSObject, ApplePayContextDelegate {

  var clientSecret: String? = nil
  var resolve: RCTPromiseResolveBlock? = nil
  var reject: RCTPromiseRejectBlock? = nil

  @objc(isApplePaySupported:rejecter:)
  func isApplePaySupported(resolver resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
      let isSupported = StripeAPI.deviceSupportsApplePay()
      resolve(isSupported)
  }

  @objc(
    pay:clientSecret:merchantIdentifier:params:resolver:rejecter:
  )
  func pay(
    publishableKey: String,
    clientSecret: String,
    merchantIdentifier: String,
    params: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    StripeAPI.defaultPublishableKey = publishableKey

    self.clientSecret = clientSecret
    self.resolve = resolve
    self.reject = reject

    let (error, paymentRequest) = ApplePayUtils.createPaymentRequest(merchantIdentifier: merchantIdentifier, params: params)
    guard let paymentRequest = paymentRequest else {
        resolve(error)
        return
    }

    if let applePayContext = STPApplePayContext(paymentRequest: paymentRequest, delegate: self) {
      applePayContext.presentApplePay()
    } else {
      reject("apple-pay-context-error", "Apple Pay context error", nil)
    }
  }

  public func applePayContext(
    _ context: STPApplePayContext,
    didCreatePaymentMethod paymentMethod: StripeCore.StripeAPI.PaymentMethod,
    paymentInformation: PKPayment, completion: @escaping STPIntentClientSecretCompletionBlock
  ) {
    completion(clientSecret, nil)
  }

  public func applePayContext(
    _ context: STPApplePayContext, didCompleteWith status: STPApplePayContext.PaymentStatus,
    error: Error?
  ) {
    switch status {
    case .success:
      resolve!("success")
      break
    case .error:
      reject!(error?.localizedDescription, error.debugDescription, nil)
      break
    case .userCancellation:
      reject!("cancelled-by-user", "Payment cancelled by user", nil)
      break
    }
  }

}
