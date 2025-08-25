import axiosInstance from "@/config/axiosConfig";


interface RequestProps {
    url: string,
    data?: any,
    config?: any
}

interface HeaderConfigProps {
    auth?: boolean;
    file?: boolean;
    params?: any;
}

class HttpServices {
    private headers = {}

    postRequest = async ({url, data, config}: RequestProps) => {
        this.setHeader(config)
        return await axiosInstance.post(url, data, {
            headers: this.headers
        })

    }

    getRequest = async ({url, config}: RequestProps) => {
        this.setHeader(config);
        return await axiosInstance.get(url, {
            headers: this.headers,
            params: config?.params || {},
        });
    };


    deleteRequest = async ({url, config}: RequestProps) => {
        this.setHeader(config)
        return await axiosInstance.delete(url, {
            headers: this.headers
        })
    }

    putRequest = async ({url, data, config}: RequestProps) => {
        this.setHeader(config)
        return await axiosInstance.put(url, data, {
            headers: this.headers
        })
    }

    private setHeader(config: HeaderConfigProps) {
        if (config && config.auth) {
            const token = localStorage.getItem("_at") || null;
            if (!token) {

                throw new Error("Login first to access this resource");
            } else {
                this.headers = {
                    ...this.headers,
                    "Authorization": `Bearer ${token}`
                }
            }
        }
        if (config && config.file) {
            this.headers = {
                ...this.headers,
                "Content-Type": "multipart/form-data"
            };
        }
        if (config && config.params) {
            this.headers = {
                ...this.headers,
                "params": config.params
            };
        }


    }

}


export default HttpServices