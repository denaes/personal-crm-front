/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReminderResponseDto = {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * User ID
     */
    userId: string;
    /**
     * Contact ID
     */
    contactId: string;
    /**
     * Type of reminder
     */
    type: ReminderResponseDto.type;
    /**
     * Custom message
     */
    message?: string;
    /**
     * Scheduled time
     */
    scheduledFor: string;
    /**
     * Cron expression for recurring reminders
     */
    repeatPattern?: string;
    /**
     * Whether the reminder is active
     */
    isActive: boolean;
    /**
     * When the reminder was last sent
     */
    lastSentAt?: string;
    /**
     * When this reminder was created
     */
    createdAt: string;
    /**
     * When this reminder was last updated
     */
    updatedAt: string;
};
export namespace ReminderResponseDto {
    /**
     * Type of reminder
     */
    export enum type {
        FOLLOW_UP = 'follow_up',
        BIRTHDAY = 'birthday',
        CUSTOM = 'custom',
    }
}

