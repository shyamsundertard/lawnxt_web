import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
    withCredentials: true,
});

export default axiosInstance;