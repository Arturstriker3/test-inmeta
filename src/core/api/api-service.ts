const urlBase = "https://cards-marketplace-api.onrender.com";

const apiService = {
    virtualBranches: `${urlBase}/api/v1/backoffice/virtual-branches`,
    information: `${urlBase}/api/v1/backoffice/info`,
    bankAccounts: `${urlBase}/api/v1/backoffice/bank-accounts`,
    customers: `${urlBase}/api/v1/backoffice/customers`,
    transactionTypes: `${urlBase}/api/v1/backoffice/transaction-types`,
    accessDevices: `${urlBase}/access-devices`,
    apiAccessDevices: `${urlBase}/api/v1/access-devices`,
    med: `${urlBase}/api/v1/backoffice/operational-dashboard`,
    creditAnalysis: `${urlBase}/api/v1/backoffice/credit-analysis`,
    banks: `${urlBase}/api/v1/backoffice/banks`,
    usageLimit: `${urlBase}/api/v1/backoffice/usage-limits`,
    limitRequest: `${urlBase}/api/v1/backoffice/usage-limits-raise-requests`,
    accountancyFiles: `${urlBase}/api/v1/backoffice/accountancy-files`,
    accountancyTransactions: `${urlBase}/api/v1/backoffice/accountancy-transactions`,
    transactionExtras: `${urlBase}/api/v1/transaction-extras`,
    charges: `${urlBase}/api/v1/charges`
}

export default apiService;