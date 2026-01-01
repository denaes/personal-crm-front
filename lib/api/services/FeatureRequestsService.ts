/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFeatureRequestDto } from '../models/CreateFeatureRequestDto';
import type { UpdateFeatureRequestDto } from '../models/UpdateFeatureRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeatureRequestsService {
    /**
     * Create a new feature request
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static featureRequestsControllerCreate(
        requestBody: CreateFeatureRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/feature-requests',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all feature requests
     * @param status
     * @param tags
     * @param sortBy
     * @param sortOrder
     * @returns any
     * @throws ApiError
     */
    public static featureRequestsControllerFindAll(
        status?: string,
        tags?: string,
        sortBy?: 'votes' | 'newest' | 'updated',
        sortOrder?: 'ASC' | 'DESC',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/feature-requests',
            query: {
                'status': status,
                'tags': tags,
                'sortBy': sortBy,
                'sortOrder': sortOrder,
            },
        });
    }
    /**
     * Get a single feature request
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static featureRequestsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/feature-requests/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update a feature request
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static featureRequestsControllerUpdate(
        id: string,
        requestBody: UpdateFeatureRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/feature-requests/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a feature request
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static featureRequestsControllerDelete(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/feature-requests/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Vote for a feature request
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static featureRequestsControllerVote(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/feature-requests/{id}/vote',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Remove vote from a feature request
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static featureRequestsControllerUnvote(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/feature-requests/{id}/vote',
            path: {
                'id': id,
            },
        });
    }
}
