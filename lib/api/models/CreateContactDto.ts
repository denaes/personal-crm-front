/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateContactDto = {
    givenName: string;
    familyName?: string;
    emailAddresses: Array<string>;
    phoneNumbers?: Array<string>;
    organization?: string;
    title?: string;
    customTags?: Array<string>;
    customNotes?: string;
    priority?: CreateContactDto.priority;
    /**
     * Follow-up frequency in days
     */
    followUpFrequencyDays?: number;
};
export namespace CreateContactDto {
    export enum priority {
        LOW = 'low',
        MEDIUM = 'medium',
        HIGH = 'high',
    }
}

