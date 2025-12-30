/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReminderDto } from '../models/CreateReminderDto';
import type { ReminderResponseDto } from '../models/ReminderResponseDto';
import type { UpdateReminderDto } from '../models/UpdateReminderDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RemindersService {
    /**
     * Create a new reminder
     * @param requestBody
     * @returns ReminderResponseDto Reminder created successfully
     * @throws ApiError
     */
    public static remindersControllerCreate(
        requestBody: CreateReminderDto,
    ): CancelablePromise<ReminderResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/reminders',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all reminders for the current user
     * @param active Filter by active reminders only
     * @returns ReminderResponseDto List of reminders
     * @throws ApiError
     */
    public static remindersControllerFindAll(
        active?: boolean,
    ): CancelablePromise<Array<ReminderResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reminders',
            query: {
                'active': active,
            },
        });
    }
    /**
     * Get all due reminders (scheduled time has passed)
     * @returns ReminderResponseDto List of due reminders
     * @throws ApiError
     */
    public static remindersControllerFindDue(): CancelablePromise<Array<ReminderResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reminders/due',
        });
    }
    /**
     * Get all reminders for a specific contact
     * @param contactId Contact ID
     * @returns ReminderResponseDto List of reminders for contact
     * @throws ApiError
     */
    public static remindersControllerFindByContact(
        contactId: string,
    ): CancelablePromise<Array<ReminderResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reminders/contact/{contactId}',
            path: {
                'contactId': contactId,
            },
        });
    }
    /**
     * Get a specific reminder by ID
     * @param id Reminder ID
     * @returns ReminderResponseDto Reminder details
     * @throws ApiError
     */
    public static remindersControllerFindOne(
        id: string,
    ): CancelablePromise<ReminderResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reminders/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Reminder not found`,
            },
        });
    }
    /**
     * Update a reminder
     * @param id Reminder ID
     * @param requestBody
     * @returns ReminderResponseDto Reminder updated successfully
     * @throws ApiError
     */
    public static remindersControllerUpdate(
        id: string,
        requestBody: UpdateReminderDto,
    ): CancelablePromise<ReminderResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/reminders/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Reminder not found`,
            },
        });
    }
    /**
     * Delete a reminder
     * @param id Reminder ID
     * @returns void
     * @throws ApiError
     */
    public static remindersControllerRemove(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/reminders/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Reminder not found`,
            },
        });
    }
    /**
     * Snooze a reminder by X hours
     * @param id Reminder ID
     * @param hours Number of hours to snooze (default: 1)
     * @returns ReminderResponseDto Reminder snoozed successfully
     * @throws ApiError
     */
    public static remindersControllerSnooze(
        id: string,
        hours?: number,
    ): CancelablePromise<ReminderResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/reminders/{id}/snooze',
            path: {
                'id': id,
            },
            query: {
                'hours': hours,
            },
            errors: {
                404: `Reminder not found`,
            },
        });
    }
}
