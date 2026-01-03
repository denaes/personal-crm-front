/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ContactDto = {
    id: string;
    givenName: string;
    familyName?: string;
    displayName: string;
    emailAddresses: Array<string>;
    phoneNumbers: Array<string>;
    photoUrl?: string;
    organization?: string;
    title?: string;
    birthdate?: string;
    customTags: Array<string>;
    customNotes?: string;
    priority: ContactDto.priority;
    followUpFrequencyDays?: number;
    lastContactedAt?: string;
    isFavorite: boolean;
    lastSyncedAt: string;
    createdAt: string;
    updatedAt: string;
};
export namespace ContactDto {
    export enum priority {
        LOW = 'low',
        MEDIUM = 'medium',
        HIGH = 'high',
    }
}

