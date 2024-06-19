class AddressUtils {
    formatZipCode({ zipCode }) {
        if (!zipCode) return ""
        else return `${zipCode.substring(0, 5)}-${zipCode.substring(5, 8)}`
    }
}

export default new AddressUtils();