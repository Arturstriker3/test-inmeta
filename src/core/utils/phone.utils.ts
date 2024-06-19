class PhoneUtils {
    formatByDddAndNumber({ ddd, number }) {
        if (ddd && number) {
            const firstDigit = number[0]; 
            const firstColumnNumber = number.slice(1, 5);
            const secondtColumnNumber = number.slice(5, 9);
            return `(${ddd}) ${firstDigit} ${firstColumnNumber}-${secondtColumnNumber}`
        }
        return "Não informado.";
    }
}

export default new PhoneUtils();