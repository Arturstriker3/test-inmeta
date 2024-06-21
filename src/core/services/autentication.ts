import apiService from "../api/api-service";
import axiosInstance from "../api/axios";

class userAutenticationService {
    urlBase = apiService.autentication;
    
    register({ name, email, password }: { name: string; email: string; password: string }) {
        return axiosInstance.post(`${this.urlBase}/register`, { name, email, password });
    }
}

export default new userAutenticationService();