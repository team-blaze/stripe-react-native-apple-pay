import Foundation

@objc(ApplePayButtonManager)
class ApplePayButtonManager: RCTViewManager {
    override func view() -> UIView! {
        let view = ApplePayButtonView(frame: CGRect.init())
        return view
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
}
