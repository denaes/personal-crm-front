/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateContactDto = {
    givenName?: string;
    familyName?: string;
    emailAddresses?: Array<string>;
    phoneNumbers?: Array<string>;
    organization?: string;
    title?: string;
    /**
     * Custom tags for the contact
     */
    customTags?: Array<string>;
    /**
     * Custom notes about the contact
     */
    customNotes?: string;
    /**
     * Priority level for this contact
     */
    priority?: UpdateContactDto.priority;
    /**
     * Preferred follow-up frequency in days
     */
    followUpFrequencyDays?: number;
    /**
     * Whether the contact is a favorite
     */
    isFavorite?: boolean;
    /**
     * Last time you contacted this person (ISO 8601 format)
     */
    lastContactedAt?: string;
};
export namespace UpdateContactDto {
    /**
     * Priority level for this contact
     */
    export enum priority {
        LOW = 'low',
        MEDIUM = 'medium',
        HIGH = 'high',
    }
}

