import { OpenAPI } from './api';
import { getAuthToken, API_CONFIG } from './api-config';

/**
 * Initialize the API client with authentication
 */
export function initializeApi() {
    // Set the base URL
    OpenAPI.BASE = API_CONFIG.baseURL;
    OpenAPI.WITH_CREDENTIALS = API_CONFIG.withCredentials;

    // Set up token resolver
    OpenAPI.TOKEN = async () => {
        const token = getAuthToken();
        return token || '';
    };

    // Set up headers
    OpenAPI.HEADERS = async () => {
        const token = getAuthToken();
        const headers: Record<string, string> = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    };
}

// Initialize on module load (client-side only)
if (typeof window !== 'undefined') {
    initializeApi();
}
