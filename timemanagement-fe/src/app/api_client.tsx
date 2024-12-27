import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    headers: {'Content-Type': 'application/json',}
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    console.log(document.referrer);

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});


apiClient.interceptors.response.use(
    (response) => response,
    (error) => {

        if (localStorage.getItem("access_token")) {
            if (error.response?.status === 403 || error.response?.status === 404) {
                window.location.href = "/hours";
            }
            return Promise.reject(error);
        }else{
            if (error.response?.status === 403 || error.response?.status === 404) {
                window.location.href = "/login";
            }
        }
    }
);

export default apiClient;
