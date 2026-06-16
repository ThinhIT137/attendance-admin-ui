import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FLASK_URL ?? "http://localhost:5000",
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response;
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);
