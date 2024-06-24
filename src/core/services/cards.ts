import apiService from "../api/api-service";
import axiosInstance from "../api/axios";

class cardsService {
    urlBase = apiService.cards;
    
    getAvailableCards({ rpp = 999999, page = 1 } = {}) {
        const query = `?rpp=${rpp}&page=${page}`;

        return axiosInstance.get(`${this.urlBase}/cards${query}`);
    }

    getUserCards() {
        return axiosInstance.get(`${this.urlBase}/me/cards`);
    }

    buyTheCard(buyedCardId: string) {
        const cardIds: any = []
        cardIds.push(buyedCardId)
        return axiosInstance.post(`${this.urlBase}/me/cards` , { cardIds });
    }

    
}

export default new cardsService();