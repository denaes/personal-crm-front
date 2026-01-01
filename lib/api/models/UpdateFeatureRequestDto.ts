/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateFeatureRequestDto = {
    title?: string;
    description?: string;
    tags?: Array<string>;
    status?: UpdateFeatureRequestDto.status;
};
export namespace UpdateFeatureRequestDto {
    export enum status {
        PROPOSED = 'proposed',
        UNDER_REVIEW = 'under-review',
        PLANNED = 'planned',
        IN_PROGRESS = 'in-progress',
        COMPLETED = 'completed',
        POSTPONED = 'postponed',
        REJECTED = 'rejected',
    }
}

