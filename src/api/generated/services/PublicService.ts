/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchStatusResponse } from '../models/BatchStatusResponse';
import type { DemoImageContentRequest } from '../models/DemoImageContentRequest';
import type { DemoLinkContentRequest } from '../models/DemoLinkContentRequest';
import type { DemoResponse } from '../models/DemoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicService {
    /**
     * Search
     * @param query
     * @param nextId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchSearchGet(
        query: string = '',
        nextId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search',
            query: {
                'query': query,
                'next_id': nextId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Health
     * Basic health check endpoint
     *
     * Returns simple status to indicate the server is running.
     * This endpoint is always available regardless of service states.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthHealthGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Create Demo Link Content
     * Test AI-Server integration with link content
     *
     * This endpoint creates REAL content in the database and sends it to AI-Server
     * for complete end-to-end testing.
     * @param requestBody
     * @returns DemoResponse Successful Response
     * @throws ApiError
     */
    public static createDemoLinkContentDemoLinkContentPost(
        requestBody: DemoLinkContentRequest,
    ): CancelablePromise<DemoResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/demo/link-content',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Demo Image Content
     * Test AI-Server integration with image content
     *
     * This endpoint creates REAL image content in the database and sends it to AI-Server
     * for complete end-to-end testing.
     * @param requestBody
     * @returns DemoResponse Successful Response
     * @throws ApiError
     */
    public static createDemoImageContentDemoImageContentPost(
        requestBody: DemoImageContentRequest,
    ): CancelablePromise<DemoResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/demo/image-content',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Batch Status
     * Check batch processing status
     *
     * Note: Batch results are now processed automatically via ProcessedBatchUpdate.
     * This endpoint is deprecated and will be removed in future versions.
     * @param batchId
     * @returns BatchStatusResponse Successful Response
     * @throws ApiError
     */
    public static getBatchStatusDemoBatchStatusBatchIdGet(
        batchId: string,
    ): CancelablePromise<BatchStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/demo/batch-status/{batch_id}',
            path: {
                'batch_id': batchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Test Ai Server Connection
     * Test connection to AI-Server
     *
     * Simple endpoint to verify AI-Server connectivity.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static testAiServerConnectionDemoTestConnectionGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/demo/test-connection',
        });
    }
    /**
     * Demo Info
     * Demo router information
     * @returns any Successful Response
     * @throws ApiError
     */
    public static demoInfoDemoGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/demo/',
        });
    }
}
