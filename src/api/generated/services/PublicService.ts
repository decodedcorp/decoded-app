/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchStatusResponse } from '../models/BatchStatusResponse';
import type { DemoImageContentRequest } from '../models/DemoImageContentRequest';
import type { DemoLinkContentRequest } from '../models/DemoLinkContentRequest';
import type { DemoResponse } from '../models/DemoResponse';
import type { SearchChannelResponse } from '../models/SearchChannelResponse';
import type { SearchContentsResponse } from '../models/SearchContentsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicService {
    /**
     * Search Contents
     * @param query
     * @param limit
     * @returns SearchContentsResponse Successful Response
     * @throws ApiError
     */
    public static searchContentsSearchContentsGet(
        query: string = '',
        limit: number = 10,
    ): CancelablePromise<SearchContentsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/contents',
            query: {
                'query': query,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Channels
     * @param query
     * @param limit
     * @returns SearchChannelResponse Successful Response
     * @throws ApiError
     */
    public static searchChannelsSearchChannelsGet(
        query: string = '',
        limit: number = 10,
    ): CancelablePromise<SearchChannelResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/channels',
            query: {
                'query': query,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Channel Contents
     * @param channelId
     * @param query
     * @param limit
     * @returns SearchContentsResponse Successful Response
     * @throws ApiError
     */
    public static searchChannelContentsSearchChannelsChannelIdContentsGet(
        channelId: string,
        query: string = '',
        limit: number = 10,
    ): CancelablePromise<SearchContentsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/channels/{channel_id}/contents',
            path: {
                'channel_id': channelId,
            },
            query: {
                'query': query,
                'limit': limit,
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
