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

    displayAllTrades({ rpp = 999999, page = 1 } = {}) {
        const query = `?rpp=${rpp}&page=${page}`;

        return axiosInstance.get(`${this.urlBase}/cards${query}`);
    }
}

export default new tradeService();