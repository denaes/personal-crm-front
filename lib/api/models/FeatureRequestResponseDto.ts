/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FeatureRequestResponseDto = {
    title: string;
    description: string;
    tags?: Array<string>;
    id: string;
    status: string;
    upvotes: number;
    hasUserVoted: boolean;
    creator: {
        id?: string;
        email?: string;
        displayName?: string;
    };
    completedAt?: Record<string, any> | null;
    createdAt: string;
    updatedAt: string;
};

