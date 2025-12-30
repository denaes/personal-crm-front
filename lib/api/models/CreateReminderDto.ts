/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateReminderDto = {
    /**
     * ID of the contact this reminder is for
     */
    contactId: string;
    /**
     * Type of reminder
     */
    type: CreateReminderDto.type;
    /**
     * Custom message for the reminder
     */
    message?: string;
    /**
     * When to send the reminder (ISO 8601 format)
     */
    scheduledFor: string;
    /**
     * Cron expression for recurring reminders
     */
    repeatPattern?: string;
    /**
     * Whether the reminder is active
     */
    isActive?: boolean;
};
export namespace CreateReminderDto {
    /**
     * Type of reminder
     */
    export enum type {
        FOLLOW_UP = 'follow_up',
        BIRTHDAY = 'birthday',
        CUSTOM = 'custom',
    }
}

