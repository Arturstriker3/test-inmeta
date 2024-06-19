import apiService from "../api/api-service";
import axiosInstance from "../api/axios";
import currencyUtils from "../utils/currency.utils";

class CreditAnalysisService {
    urlBase = apiService.usageLimit;
    
    getAccountLimits(bankAccountNumber : number) {
        return axiosInstance.get(`${this.urlBase}/${bankAccountNumber}`)
    }

    putAccountLimits(bankAccountNumber, paymentLimits, transfersLimits) {

        const paymentDayDefinedAmount = currencyUtils.removeMask(paymentLimits.paymentDayDefined);

        const paymentNightDefinedAmount = currencyUtils.removeMask(paymentLimits.paymentNightDefined);

        const paymentMaximumAmount = currencyUtils.removeMask(paymentLimits.paymentMaximum);

        const transfersDayDefinedAmount = currencyUtils.removeMask(transfersLimits.transfersDayDefined);

        const transfersNightDefinedAmount = currencyUtils.removeMask(transfersLimits.transfersNightDefined);

        const transfersMaximumAmount = currencyUtils.removeMask(transfersLimits.transfersMaximum);

        const paymentData = [
            {
                "serviceType": "PAYMENT",
                "limitType": "DAYTIME_TOTAL",
                "definedAmount": paymentDayDefinedAmount,
                "maximumAmount": paymentMaximumAmount
            },
            {
                "serviceType": "PAYMENT",
                "limitType": "NIGHTTIME_TOTAL",
                "definedAmount": paymentNightDefinedAmount,
                "maximumAmount": paymentMaximumAmount
            }
        ];
    
        const transferData = [
            {
                "serviceType": "TRANSFERS",
                "limitType": "DAYTIME_TOTAL",
                "definedAmount": transfersDayDefinedAmount,
                "maximumAmount": transfersMaximumAmount
            },
            {
                "serviceType": "TRANSFERS",
                "limitType": "NIGHTTIME_TOTAL",
                "definedAmount": transfersNightDefinedAmount,
                "maximumAmount": transfersMaximumAmount
            }
        ];

        return axiosInstance.put(`${this.urlBase}/${bankAccountNumber}`, [ ...paymentData, ...transferData ]);
    }
}

export default new CreditAnalysisService();