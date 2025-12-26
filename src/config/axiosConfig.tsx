import axios, {AxiosError} from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    maxRedirects: 5,
});

axiosInstance.interceptors.request.use(
    (config: any) => {
        console.log("➡️ FULL REQUEST URL:", config.baseURL + config.url);
        return config;
    },
    (error: AxiosError) => {
        console.error("Request Error from axios:", error);
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (config: any) => {
        //TODO
        return config;
    },
    (error: any) => {

        return Promise.reject(error?.response);
    }
);

export default axiosInstance;