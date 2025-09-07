/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TrendingResponse } from '../models/TrendingResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TrendingService {
    /**
     * Get Popular Trends
     * Get popular content and channels based on accumulated engagement scores
     * @param category Category type: content or channels
     * @param limit Number of items to return
     * @returns TrendingResponse Successful Response
     * @throws ApiError
     */
    public static getPopularTrendsTrendingPopularGet(
        category: string,
        limit: number = 20,
    ): CancelablePromise<TrendingResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/trending/popular',
            query: {
                'category': category,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Current Trends
     * Get trending content and channels based on recent activity
     * @param category Category type: content or channels
     * @param limit Number of items to return
     * @param hours Time window in hours for trending calculation
     * @returns TrendingResponse Successful Response
     * @throws ApiError
     */
    public static getCurrentTrendsTrendingTrendingGet(
        category: string,
        limit: number = 20,
        hours: number = 24,
    ): CancelablePromise<TrendingResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/trending/trending',
            query: {
                'category': category,
                'limit': limit,
                'hours': hours,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
