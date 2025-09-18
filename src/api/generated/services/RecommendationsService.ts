/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelRecommendationsResponse } from '../models/ChannelRecommendationsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RecommendationsService {
    /**
     * Recommend Channels
     * @param limit
     * @param skip
     * @param userId
     * @returns ChannelRecommendationsResponse Successful Response
     * @throws ApiError
     */
    public static recommendChannelsRecommendationsChannelsGet(
        limit: number = 10,
        skip?: number,
        userId?: (string | null),
    ): CancelablePromise<ChannelRecommendationsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recommendations/channels',
            query: {
                'limit': limit,
                'skip': skip,
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
