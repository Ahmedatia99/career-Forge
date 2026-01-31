import { refreshToken } from '@/services/auth.service';
import { getToken, setToken, clearToken } from "./auth-storage";

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

api.interceptors.request.use((config) => {
    const token = getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})


api.interceptors.response.use(res => res, async(error)=>{
    console.log("Axios error interceptor:", error.response?.status, error.config?.url);
    
    if(error.response?.status === 401){
        // Don't try to refresh token for auth endpoints
        const isAuthEndpoint =
            error.config?.url?.includes('/auth/login') ||
            error.config?.url?.includes('/auth/register') ||
            error.config?.url?.includes('/auth/refresh') ||
            error.config?.url?.includes('/v1/auth/login') ||
            error.config?.url?.includes('/v1/auth/register') ||
            error.config?.url?.includes('/v1/auth/refresh');

        if (isAuthEndpoint) {
            return Promise.reject(error);
        }

        // Check if we already tried to refresh (prevent infinite loop)
        if (error.config?._retry) {
            console.log("Already retried, clearing token and redirecting");
            clearToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        try {
            console.log("Attempting to refresh token...");
            error.config._retry = true;
            const res = await refreshToken();
            console.log("Refresh response:", res?.data);
            const resData = res?.data as any;
            const tokenValue = resData?.data?.token || resData?.token || resData?.accessToken || resData?.data?.accessToken;
            if (tokenValue) {
                console.log("New token received, retrying request");
                setToken({ token: tokenValue });
                error.config.headers = error.config.headers || {};
                error.config.headers.Authorization = `Bearer ${tokenValue}`;
                return api.request(error.config);
            }
            throw new Error('No token returned from refresh');
        } catch (err) {
            console.log("Refresh token failed:", err);
            clearToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            return Promise.reject(err);
        }
    }
    return Promise.reject(error);
})
export default api;