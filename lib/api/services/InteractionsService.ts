/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateInteractionDto } from '../models/CreateInteractionDto';
import type { UpdateInteractionDto } from '../models/UpdateInteractionDto';
import type { WrappedInteractionListResponseDto } from '../models/WrappedInteractionListResponseDto';
import type { WrappedInteractionResponseDto } from '../models/WrappedInteractionResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InteractionsService {
    /**
     * Create a new interaction
     * @param requestBody
     * @returns WrappedInteractionResponseDto Interaction created successfully
     * @throws ApiError
     */
    public static interactionsControllerCreate(
        requestBody: CreateInteractionDto,
    ): CancelablePromise<WrappedInteractionResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/interactions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all interactions for the current user
     * @returns WrappedInteractionListResponseDto List of interactions
     * @throws ApiError
     */
    public static interactionsControllerFindAll(): CancelablePromise<WrappedInteractionListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/interactions',
        });
    }
    /**
     * Get all interactions for a specific contact
     * @param contactId Contact ID
     * @returns WrappedInteractionListResponseDto List of interactions for contact
     * @throws ApiError
     */
    public static interactionsControllerFindByContact(
        contactId: string,
    ): CancelablePromise<WrappedInteractionListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/interactions/contact/{contactId}',
            path: {
                'contactId': contactId,
            },
        });
    }
    /**
     * Get a specific interaction by ID
     * @param id Interaction ID
     * @returns WrappedInteractionResponseDto Interaction details
     * @throws ApiError
     */
    public static interactionsControllerFindOne(
        id: string,
    ): CancelablePromise<WrappedInteractionResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/interactions/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Interaction not found`,
            },
        });
    }
    /**
     * Update an interaction
     * @param id Interaction ID
     * @param requestBody
     * @returns WrappedInteractionResponseDto Interaction updated successfully
     * @throws ApiError
     */
    public static interactionsControllerUpdate(
        id: string,
        requestBody: UpdateInteractionDto,
    ): CancelablePromise<WrappedInteractionResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/interactions/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Interaction not found`,
            },
        });
    }
    /**
     * Delete an interaction
     * @param id Interaction ID
     * @returns void
     * @throws ApiError
     */
    public static interactionsControllerRemove(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/interactions/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Interaction not found`,
            },
        });
    }
}
