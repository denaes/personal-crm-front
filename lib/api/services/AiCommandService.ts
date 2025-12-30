/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommandRequestDto } from '../models/CommandRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiCommandService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static aiCommandControllerProcessCommand(
        requestBody: CommandRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ai/command',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
