// API Configuration
// This file will be updated once we generate the API client

const getBaseUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    // Strip /api/v1 suffix because the generated client includes it in paths
    return url.replace(/\/api\/v1\/?$/, '');
};

export const API_CONFIG = {
    baseURL: getBaseUrl(),
    timeout: 30000,
    withCredentials: true,
};

// Token management
export const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
    }
};

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

export const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
    }
};

import axios from 'axios';

export const api = axios.create(API_CONFIG);

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
