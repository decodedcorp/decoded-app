/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BannerUpdate } from '../models/BannerUpdate';
import type { ChannelCreate } from '../models/ChannelCreate';
import type { ChannelListResponse } from '../models/ChannelListResponse';
import type { ChannelResponse } from '../models/ChannelResponse';
import type { ChannelUpdate } from '../models/ChannelUpdate';
import type { ThumbnailUpdate } from '../models/ThumbnailUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChannelsService {
    /**
     * List Channels
     * List channels with pagination and filtering
     *
     * - is_manager=true: Returns channels where current user is owner or manager (requires auth)
     * - owner_id: Returns channels owned by specific user
     * - search: Search channels by name
     * @param page
     * @param limit
     * @param search
     * @param ownerId
     * @param isManager
     * @param sortBy
     * @param sortOrder
     * @returns ChannelListResponse Successful Response
     * @throws ApiError
     */
    public static listChannelsChannelsGet(
        page: number = 1,
        limit: number = 20,
        search?: string,
        ownerId?: string,
        isManager?: (boolean | null),
        sortBy: string = 'created_at',
        sortOrder: string = 'desc',
    ): CancelablePromise<ChannelListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/channels/',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'owner_id': ownerId,
                'is_manager': isManager,
                'sort_by': sortBy,
                'sort_order': sortOrder,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Channel
     * Create a new channel
     * @param requestBody
     * @returns ChannelResponse Successful Response
     * @throws ApiError
     */
    public static createChannelChannelsPost(
        requestBody: ChannelCreate,
    ): CancelablePromise<ChannelResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/channels/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Channel
     * Get channel information - public endpoint
     * @param channelId
     * @returns ChannelResponse Successful Response
     * @throws ApiError
     */
    public static getChannelChannelsChannelIdGet(
        channelId: string,
    ): CancelablePromise<ChannelResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Channel
     * Update channel information (owner only)
     * @param channelId
     * @param requestBody
     * @returns ChannelResponse Successful Response
     * @throws ApiError
     */
    public static updateChannelChannelsChannelIdPut(
        channelId: string,
        requestBody: ChannelUpdate,
    ): CancelablePromise<ChannelResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Channel
     * Delete channel (owner only)
     * @param channelId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteChannelChannelsChannelIdDelete(
        channelId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Thumbnail
     * Update channel thumbnail (owner only)
     * @param channelId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateThumbnailChannelsChannelIdThumbnailPatch(
        channelId: string,
        requestBody: ThumbnailUpdate,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/channels/{channel_id}/thumbnail',
            path: {
                'channel_id': channelId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Banner
     * Update channel banner (owner only)
     * @param channelId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateBannerChannelsChannelIdBannerPatch(
        channelId: string,
        requestBody: BannerUpdate,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/channels/{channel_id}/banner',
            path: {
                'channel_id': channelId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
