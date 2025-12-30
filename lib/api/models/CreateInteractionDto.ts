/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateInteractionDto = {
    /**
     * ID of the contact this interaction is with
     */
    contactId: string;
    /**
     * Type of interaction
     */
    type: CreateInteractionDto.type;
    /**
     * Content/notes from the interaction
     */
    content: string;
    /**
     * Additional metadata about the interaction
     */
    metadata?: Record<string, any>;
    /**
     * When the interaction occurred (ISO 8601 format)
     */
    occurredAt: string;
};
export namespace CreateInteractionDto {
    /**
     * Type of interaction
     */
    export enum type {
        CALL = 'call',
        EMAIL = 'email',
        MEETING = 'meeting',
        MESSAGE = 'message',
        NOTE = 'note',
        GIFT = 'gift',
        EVENT = 'event',
    }
}

