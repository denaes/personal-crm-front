/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Initiate Google OAuth login
     * @returns any
     * @throws ApiError
     */
    public static authControllerGoogleAuth(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/google',
        });
    }
    /**
     * Google OAuth callback
     * @returns any
     * @throws ApiError
     */
    public static authControllerGoogleAuthCallback(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/google/callback',
        });
    }
    /**
     * Refresh access token
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static authControllerRefresh(
        requestBody: {
            refreshToken?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get current user profile
     * @returns any
     * @throws ApiError
     */
    public static authControllerGetProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/profile',
        });
    }
    /**
     * Logout (client should discard tokens)
     * @returns any
     * @throws ApiError
     */
    public static authControllerLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/logout',
        });
    }
}
