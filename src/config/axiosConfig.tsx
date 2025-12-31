import axios, { AxiosError } from "axios";

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
        const params = config.params
        const query = params
            ? `?${new URLSearchParams(params).toString()}`
            : ""
        console.log("➡️ FULL REQUEST URL:", config.baseURL + config.url + query);
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
        console.error("Response Error from axios:", error);
        if (error.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("_at");
            localStorage.removeItem("_role");
            window.location.href = "/login";

        }

        return Promise.reject(error?.response);
    }
);

export default axiosInstance;