enum ErrorType {
    static let Failed = "Failed"
    static let Canceled = "Canceled"
    static let Unknown = "Unknown"
    static let Timeout = "Timeout"
}

class Errors {
    class func createError (_ code: String, _ message: String?) -> NSDictionary {
        let value: NSDictionary = [
            "code": code,
            "message": message ?? NSNull(),
            "localizedMessage": message ?? NSNull(),
            "declineCode": NSNull(),
            "stripeErrorCode": NSNull(),
            "type": NSNull()
        ]
        
        return ["error": value]
    }
    
    class func getRootError(_ error: NSError?) -> NSError? {
        // Dig and find the underlying error, otherwise we'll throw errors like "Try again"
        if let underlyingError = error?.userInfo[NSUnderlyingErrorKey] as? NSError {
            return getRootError(underlyingError)
        }
        return error
    }
    
    static let MISSING_INIT_ERROR = Errors.createError(ErrorType.Failed, "Stripe has not been initialized. Initialize Stripe in your app with the StripeProvider component or the initStripe method.")
}

