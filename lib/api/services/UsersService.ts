/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateUserRoleDto } from '../models/UpdateUserRoleDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get all users (Admin only)
     * @returns any
     * @throws ApiError
     */
    public static usersControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users',
        });
    }
    /**
     * Get current user profile
     * @returns any
     * @throws ApiError
     */
    public static usersControllerGetCurrentUser(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/me',
        });
    }
    /**
     * Update user role (Admin only)
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static usersControllerUpdateRole(
        id: string,
        requestBody: UpdateUserRoleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/users/{id}/role',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
