/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeedHealthResponse } from '../models/FeedHealthResponse';
import type { FeedListResponse } from '../models/FeedListResponse';
import type { FeedResponse } from '../models/FeedResponse';
import type { FeedStatsResponse } from '../models/FeedStatsResponse';
import type { FeedType } from '../models/FeedType';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeedsService {
    /**
     * Get Recent Feed
     * Get recent image contents feed
     * @param limit
     * @param skip
     * @param daysBack
     * @returns FeedResponse Successful Response
     * @throws ApiError
     */
    public static getRecentFeedFeedsRecentGet(
        limit?: (number | null),
        skip?: (number | null),
        daysBack?: (number | null),
    ): CancelablePromise<FeedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/recent',
            query: {
                'limit': limit,
                'skip': skip,
                'days_back': daysBack,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Popular Feed
     * Get popular image contents feed based on likes
     * @param limit
     * @param skip
     * @param minLikes
     * @returns FeedResponse Successful Response
     * @throws ApiError
     */
    public static getPopularFeedFeedsPopularGet(
        limit?: (number | null),
        skip?: (number | null),
        minLikes?: (number | null),
    ): CancelablePromise<FeedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/popular',
            query: {
                'limit': limit,
                'skip': skip,
                'min_likes': minLikes,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Trending Feed
     * Get trending image contents feed (recent + popular)
     * @param limit
     * @param skip
     * @param hoursBack
     * @returns FeedResponse Successful Response
     * @throws ApiError
     */
    public static getTrendingFeedFeedsTrendingGet(
        limit?: (number | null),
        skip?: (number | null),
        hoursBack?: (number | null),
    ): CancelablePromise<FeedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/trending',
            query: {
                'limit': limit,
                'skip': skip,
                'hours_back': hoursBack,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Mixed Feed
     * Get mixed feed combining recent and popular content
     * @param limit
     * @param skip
     * @param recentRatio
     * @returns FeedResponse Successful Response
     * @throws ApiError
     */
    public static getMixedFeedFeedsMixedGet(
        limit?: (number | null),
        skip?: (number | null),
        recentRatio?: (number | null),
    ): CancelablePromise<FeedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/mixed',
            query: {
                'limit': limit,
                'skip': skip,
                'recent_ratio': recentRatio,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Channel Feed
     * Get feed for a specific channel
     * @param channelId
     * @param limit
     * @param skip
     * @returns FeedResponse Successful Response
     * @throws ApiError
     */
    public static getChannelFeedFeedsChannelChannelIdGet(
        channelId: string,
        limit?: (number | null),
        skip?: (number | null),
    ): CancelablePromise<FeedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/channel/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            query: {
                'limit': limit,
                'skip': skip,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Provider Feed
     * Get feed for a specific provider/user
     * @param providerId
     * @param limit
     * @param skip
     * @returns FeedResponse Successful Response
     * @throws ApiError
     */
    public static getProviderFeedFeedsProviderProviderIdGet(
        providerId: string,
        limit?: (number | null),
        skip?: (number | null),
    ): CancelablePromise<FeedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/provider/{provider_id}',
            path: {
                'provider_id': providerId,
            },
            query: {
                'limit': limit,
                'skip': skip,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Feed
     * Search image contents feed
     * @param query
     * @param limit
     * @param skip
     * @returns FeedResponse Successful Response
     * @throws ApiError
     */
    public static searchFeedFeedsSearchGet(
        query: string,
        limit?: (number | null),
        skip?: (number | null),
    ): CancelablePromise<FeedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/search',
            query: {
                'query': query,
                'limit': limit,
                'skip': skip,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Multiple Feeds
     * Get multiple feed types in one response (recent, popular, trending)
     * @param limit
     * @returns FeedListResponse Successful Response
     * @throws ApiError
     */
    public static getMultipleFeedsFeedsMultipleGet(
        limit?: (number | null),
    ): CancelablePromise<FeedListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/multiple',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Feed Stats
     * Get feed statistics
     * @returns FeedStatsResponse Successful Response
     * @throws ApiError
     */
    public static getFeedStatsFeedsStatsGet(): CancelablePromise<FeedStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/stats',
        });
    }
    /**
     * Get Feed Health
     * Get feed health status
     * @returns FeedHealthResponse Successful Response
     * @throws ApiError
     */
    public static getFeedHealthFeedsHealthGet(): CancelablePromise<FeedHealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/health',
        });
    }
    /**
     * Get Default Feed
     * Get default feed - configurable feed type
     * @param feedType
     * @param limit
     * @param skip
     * @returns FeedResponse Successful Response
     * @throws ApiError
     */
    public static getDefaultFeedFeedsGet(
        feedType?: (FeedType | null),
        limit?: (number | null),
        skip?: (number | null),
    ): CancelablePromise<FeedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feeds/',
            query: {
                'feed_type': feedType,
                'limit': limit,
                'skip': skip,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
