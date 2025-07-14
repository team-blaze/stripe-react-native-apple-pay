import Foundation
import PassKit
import StripeApplePay

@objc(StripeApplePay)
class StripeApplePay: NSObject, ApplePayContextDelegate {
  var merchantIdentifier: String? = nil

  var confirmApplePayResolver: RCTPromiseResolveBlock? = nil
  var confirmApplePayClientSecret: String? = nil

  @objc(initialise:resolver:rejecter:)
  func initialise(params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
      let publishableKey = params["publishableKey"] as! String
      let merchantIdentifier = params["merchantIdentifier"] as? String

      StripeAPI.defaultPublishableKey = publishableKey

      self.merchantIdentifier = merchantIdentifier

      resolve(NSNull())
  }

  @objc(isPlatformPaySupported:rejecter:)
  func isPlatformPaySupported(resolver resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
      resolve(StripeAPI.deviceSupportsApplePay())
  }

  @objc(confirmPlatformPay:params:resolver:rejecter:)
  func confirmPlatformPay(
      clientSecret: String?,
      params: NSDictionary,
      resolver resolve: @escaping RCTPromiseResolveBlock,
      rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
      guard let applePayParams = params["applePay"] as? NSDictionary else {
          resolve(Errors.createError(ErrorType.Failed, "You must provide the `applePay` parameter."))
          return
      }
      let (error, paymentRequest) = ApplePayUtils.createPaymentRequest(merchantIdentifier: merchantIdentifier, params: applePayParams)
      guard let paymentRequest = paymentRequest else {
          resolve(error)
          return
      }

      self.confirmApplePayClientSecret = clientSecret
      self.confirmApplePayResolver = resolve

      if let applePayContext = STPApplePayContext(paymentRequest: paymentRequest, delegate: self) {
          DispatchQueue.main.async {
              applePayContext.presentApplePay(completion: nil)
          }
      } else {
          resolve(Errors.createError(ErrorType.Failed, "Payment not completed"))
      }
  }

  public func applePayContext(
    _ context: STPApplePayContext,
    didCreatePaymentMethod paymentMethod: StripeCore.StripeAPI.PaymentMethod,
    paymentInformation: PKPayment, completion: @escaping STPIntentClientSecretCompletionBlock
  ) {
    if let clientSecret = self.confirmApplePayClientSecret {
        completion(clientSecret, nil)
    } else {
        RCTMakeAndLogError("Tried to complete Apple Pay payment, but no client secret was found.", nil, nil)
    }
  }

  public func applePayContext(
    _ context: STPApplePayContext, didCompleteWith status: STPApplePayContext.PaymentStatus,
    error: Error?
  ) {
    switch status {
    case .success:
        if let resolve = self.confirmApplePayResolver {
            resolve(["result": "success"])
        }
        break
    case .error:
        if let resolve = self.confirmApplePayResolver {
            resolve(Errors.createError(ErrorType.Failed, error as NSError?))
        }
        break
    case .userCancellation:
        let message = "The payment has been canceled"
        if let resolve = self.confirmApplePayResolver {
            resolve(Errors.createError(ErrorType.Canceled, message))
        }
        break
    @unknown default:
        if let resolve = self.confirmApplePayResolver {
            resolve(Errors.createError(ErrorType.Unknown, error as NSError?))
        }
        break
    }
  }

}
