/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WrappedAuditLogListResponseDto } from '../models/WrappedAuditLogListResponseDto';
import type { WrappedAuditLogResponseDto } from '../models/WrappedAuditLogResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuditLogsService {
    /**
     * Get all audit logs
     * @returns WrappedAuditLogListResponseDto
     * @throws ApiError
     */
    public static auditLogsControllerFindAll(): CancelablePromise<WrappedAuditLogListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/audit-logs',
        });
    }
    /**
     * Get a single audit log by ID
     * @param id
     * @returns WrappedAuditLogResponseDto
     * @throws ApiError
     */
    public static auditLogsControllerFindOne(
        id: string,
    ): CancelablePromise<WrappedAuditLogResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/audit-logs/{id}',
            path: {
                'id': id,
            },
        });
    }
}
