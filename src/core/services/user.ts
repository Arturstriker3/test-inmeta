import apiService from "../api/api-service";
import axiosInstance from "../api/axios";

class userService {
    urlBase = apiService.trade;
    
    requestUserData() {
        return axiosInstance.get(`${this.urlBase}/me`);
    }
}

export default new userService();