/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MetricsService {
    /**
     * Get Total Metrics
     * @returns any Get total metrics
     * @throws ApiError
     */
    public static getTotalMetricsTotalMetricsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/total/metrics',
        });
    }
    /**
     * Get Daily Metrics
     * @returns any Get daily metrics
     * @throws ApiError
     */
    public static getDailyMetricsDailyMetricsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/daily/metrics',
        });
    }
    /**
     * Get Random Resources
     * @param type Type of random resources
     * @param limit Limit of random resources
     * @returns any Get random resources
     * @throws ApiError
     */
    public static getRandomResourcesRandomGet(
        type: string = 'image',
        limit: number = 5,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/random',
            query: {
                'type': type,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Trending Items
     * @param min Minimum number of items to return
     * @param limit Limit of trending items
     * @returns any Get trending items
     * @throws ApiError
     */
    public static getTrendingItemsMetricsTrendingItemsGet(
        min?: (number | null),
        limit: number = 10,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/metrics/trending/items',
            query: {
                'min': min,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Trending Images
     * @param min Minimum number of images to return
     * @param limit Limit of trending images
     * @returns any Get trending images
     * @throws ApiError
     */
    public static getTrendingImagesMetricsTrendingImagesGet(
        min?: (number | null),
        limit: number = 10,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/metrics/trending/images',
            query: {
                'min': min,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Trending Keywords
     * @param min Minimum number of keywords to return
     * @param limit Limit of trending keywords
     * @returns any Get trending keywords
     * @throws ApiError
     */
    public static getTrendingKeywordsMetricsTrendingKeywordsGet(
        min?: (number | null),
        limit: number = 10,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/metrics/trending/keywords',
            query: {
                'min': min,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
