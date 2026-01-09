import { refreshToken } from '@/services/auth.service';
import { getToken, setToken, clearToken } from "./auth-storage";

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

api.interceptors.request.use((config) => {

    const token = getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})


api.interceptors.response.use(res => res, async(error)=>{
    if(error.response?.status === 401){
        // Don't try to refresh token for login/register endpoints
        const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                              error.config?.url?.includes('/auth/register');
        
        if(isAuthEndpoint) {
            return Promise.reject(error);
        }
        
        try {
            const res = await refreshToken()
            setToken(res.data.token);
            error.config.headers.Authorization = `Bearer ${res.data.token}`;
            return api.request(error.config);
        } catch (error) {
            clearToken();
            window.location.href = '/login';
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
})
export default api;