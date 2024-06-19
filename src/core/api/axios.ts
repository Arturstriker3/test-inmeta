import axios from "axios";
import { useAlertStore } from "../stores/alert";
import errorUtils from "../utils/error.utils";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((request) => {
    const accessToken = localStorage.getItem("accessToken");
    request.headers.Authorization = `Bearer ${accessToken}`;
    return request;
})

axiosInstance.interceptors.response.use(response => response, (error) => {
    const alertContext = useAlertStore();
    alertContext.openAlert({ message: errorUtils.get(error), severity: "error", time: 3000 })
    return Promise.reject(error);
})

export default axiosInstance;