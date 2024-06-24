import apiService from "../api/api-service";
import axiosInstance from "../api/axios";

class tradeService {
    urlBase = apiService.trade;
    
    requestTrade(userSendCards: any[], userRequestCards: any[]) {
        const cards = [
            ...userSendCards.map(card => ({ cardId: card.id, type: "OFFERING" })),
            ...userRequestCards.map(card => ({ cardId: card.id, type: "RECEIVING" }))
        ];

        return axiosInstance.post(`${this.urlBase}/trades`, { cards });
    }     
}

export default new tradeService();