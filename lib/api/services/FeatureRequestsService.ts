/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFeatureRequestDto } from '../models/CreateFeatureRequestDto';
import type { UpdateFeatureRequestDto } from '../models/UpdateFeatureRequestDto';
import type { WrappedFeatureRequestListResponseDto } from '../models/WrappedFeatureRequestListResponseDto';
import type { WrappedFeatureRequestResponseDto } from '../models/WrappedFeatureRequestResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeatureRequestsService {
    /**
     * Create a new feature request
     * @param requestBody
     * @returns WrappedFeatureRequestResponseDto Feature request created successfully
     * @throws ApiError
     */
    public static featureRequestsControllerCreate(
        requestBody: CreateFeatureRequestDto,
    ): CancelablePromise<WrappedFeatureRequestResponseDto> {
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
     * @returns WrappedFeatureRequestListResponseDto List of feature requests
     * @throws ApiError
     */
    public static featureRequestsControllerFindAll(
        status?: string,
        tags?: string,
        sortBy?: 'votes' | 'newest' | 'updated',
        sortOrder?: 'ASC' | 'DESC',
    ): CancelablePromise<WrappedFeatureRequestListResponseDto> {
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
     * @returns WrappedFeatureRequestResponseDto Feature request details
     * @throws ApiError
     */
    public static featureRequestsControllerFindOne(
        id: string,
    ): CancelablePromise<WrappedFeatureRequestResponseDto> {
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
     * @returns WrappedFeatureRequestResponseDto Feature request updated successfully
     * @throws ApiError
     */
    public static featureRequestsControllerUpdate(
        id: string,
        requestBody: UpdateFeatureRequestDto,
    ): CancelablePromise<WrappedFeatureRequestResponseDto> {
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
     * @returns WrappedFeatureRequestResponseDto Vote added
     * @throws ApiError
     */
    public static featureRequestsControllerVote(
        id: string,
    ): CancelablePromise<WrappedFeatureRequestResponseDto> {
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
     * @returns WrappedFeatureRequestResponseDto Vote removed
     * @throws ApiError
     */
    public static featureRequestsControllerUnvote(
        id: string,
    ): CancelablePromise<WrappedFeatureRequestResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/feature-requests/{id}/vote',
            path: {
                'id': id,
            },
        });
    }
}
