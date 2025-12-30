/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateContactDto } from '../models/CreateContactDto';
import type { UpdateContactDto } from '../models/UpdateContactDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContactsService {
    /**
     * List all contacts
     * @param page
     * @param limit
     * @param priority
     * @param tags
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerFindAll(
        page?: number,
        limit?: number,
        priority?: 'low' | 'medium' | 'high',
        tags?: string,
        sortBy?: string,
        sortOrder?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/contacts',
            query: {
                'page': page,
                'limit': limit,
                'priority': priority,
                'tags': tags,
                'sortBy': sortBy,
                'sortOrder': sortOrder,
            },
        });
    }
    /**
     * Create new contact (syncs to Google)
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerCreate(
        requestBody: CreateContactDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/contacts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Search contacts
     * @param q
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerSearch(
        q: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/contacts/search',
            query: {
                'q': q,
            },
        });
    }
    /**
     * Get contact by ID
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/contacts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update contact (syncs to Google)
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerUpdate(
        id: string,
        requestBody: UpdateContactDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/contacts/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete contact (syncs to Google)
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static contactsControllerDelete(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/contacts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Trigger manual sync with Google Contacts
     * @param type
     * @returns any
     * @throws ApiError
     */
    public static contactsControllerSync(
        type?: 'full' | 'incremental',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/contacts/sync',
            query: {
                'type': type,
            },
        });
    }
}
