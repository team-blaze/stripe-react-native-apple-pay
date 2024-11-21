import PassKit

class Mappers {
    class func mapToPKContactField(field: String) -> PKContactField {
        switch field {
        case "emailAddress": return PKContactField.emailAddress
        case "name": return PKContactField.name
        case "phoneNumber": return PKContactField.phoneNumber
        case "phoneticName": return PKContactField.phoneticName
        case "postalAddress": return PKContactField.postalAddress
        default: return PKContactField.name
        }
    }
}
