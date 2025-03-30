/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Response } from '../models/Response';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConfigsService {
    /**
     * Get System Config
     * Get system configuration.
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getSystemConfigAdminUserDocIdSystemConfigsGet(): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/system-configs',
        });
    }
    /**
     * Update System Config
     * Update system configuration.
     * @param requestBody
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static updateSystemConfigAdminUserDocIdSystemConfigsUpdatePatch(
        requestBody: Record<string, any>,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/{user_doc_id}/system-configs/update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
