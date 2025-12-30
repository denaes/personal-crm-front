/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InteractionResponseDto = {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * User ID who logged the interaction
     */
    userId: string;
    /**
     * Contact ID
     */
    contactId: string;
    /**
     * Contact details
     */
    contact?: Record<string, any>;
    /**
     * Type of interaction
     */
    type: InteractionResponseDto.type;
    /**
     * Content of the interaction
     */
    content: string;
    /**
     * Additional metadata
     */
    metadata?: Record<string, any>;
    /**
     * When the interaction occurred
     */
    occurredAt: string;
    /**
     * When this record was created
     */
    createdAt: string;
    /**
     * When this record was last updated
     */
    updatedAt: string;
};
export namespace InteractionResponseDto {
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

