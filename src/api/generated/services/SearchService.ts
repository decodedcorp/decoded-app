/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SearchChannelResponse } from '../models/SearchChannelResponse';
import type { SearchContentsResponse } from '../models/SearchContentsResponse';
import type { SearchUsersResponse } from '../models/SearchUsersResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SearchService {
    /**
     * Search Contents
     * @param query
     * @param limit
     * @param page
     * @returns SearchContentsResponse Successful Response
     * @throws ApiError
     */
    public static searchContentsSearchContentsGet(
        query: string = '',
        limit: number = 10,
        page?: (number | null),
    ): CancelablePromise<SearchContentsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/contents',
            query: {
                'query': query,
                'limit': limit,
                'page': page,
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
     * @param page
     * @returns SearchChannelResponse Successful Response
     * @throws ApiError
     */
    public static searchChannelsSearchChannelsGet(
        query: string = '',
        limit: number = 10,
        page?: (number | null),
    ): CancelablePromise<SearchChannelResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/channels',
            query: {
                'query': query,
                'limit': limit,
                'page': page,
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
     * @param page
     * @returns SearchContentsResponse Successful Response
     * @throws ApiError
     */
    public static searchChannelContentsSearchChannelsChannelIdContentsGet(
        channelId: string,
        query: string = '',
        limit: number = 10,
        page?: (number | null),
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
                'page': page,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Users
     * @param query
     * @param limit
     * @returns SearchUsersResponse Successful Response
     * @throws ApiError
     */
    public static searchUsersSearchUsersGet(
        query: string = '',
        limit: number = 10,
    ): CancelablePromise<SearchUsersResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/users',
            query: {
                'query': query,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
