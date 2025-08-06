/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelSubscriptionStatsResponse } from '../models/ChannelSubscriptionStatsResponse';
import type { ContentLikeStatsResponse } from '../models/ContentLikeStatsResponse';
import type { InteractionStatsResponse } from '../models/InteractionStatsResponse';
import type { LikeCreateRequest } from '../models/LikeCreateRequest';
import type { LikeListResponse } from '../models/LikeListResponse';
import type { LikeResponse } from '../models/LikeResponse';
import type { NotificationCreateRequest } from '../models/NotificationCreateRequest';
import type { NotificationListResponse } from '../models/NotificationListResponse';
import type { NotificationMarkReadRequest } from '../models/NotificationMarkReadRequest';
import type { NotificationResponse } from '../models/NotificationResponse';
import type { SubscriptionCreateRequest } from '../models/SubscriptionCreateRequest';
import type { SubscriptionListResponse } from '../models/SubscriptionListResponse';
import type { SubscriptionResponse } from '../models/SubscriptionResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InteractionsService {
    /**
     * Get My Likes
     * Get current user's likes list
     * @param limit
     * @param skip
     * @returns LikeListResponse Successful Response
     * @throws ApiError
     */
    public static getMyLikesMeLikesGet(
        limit: number = 50,
        skip?: number,
    ): CancelablePromise<LikeListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/likes',
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
     * Get My Likes
     * Get current user's likes list
     * @param limit
     * @param skip
     * @returns LikeListResponse Successful Response
     * @throws ApiError
     */
    public static getMyLikesMeLikesGet1(
        limit: number = 50,
        skip?: number,
    ): CancelablePromise<LikeListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/likes',
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
     * Get My Subscriptions
     * Get current user's subscriptions list
     * @param limit
     * @param skip
     * @returns SubscriptionListResponse Successful Response
     * @throws ApiError
     */
    public static getMySubscriptionsMeSubscriptionsGet(
        limit: number = 50,
        skip?: number,
    ): CancelablePromise<SubscriptionListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/subscriptions',
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
     * Get My Subscriptions
     * Get current user's subscriptions list
     * @param limit
     * @param skip
     * @returns SubscriptionListResponse Successful Response
     * @throws ApiError
     */
    public static getMySubscriptionsMeSubscriptionsGet1(
        limit: number = 50,
        skip?: number,
    ): CancelablePromise<SubscriptionListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/subscriptions',
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
     * Get My Notifications
     * Get current user's notifications list
     * @param isRead
     * @param limit
     * @param skip
     * @returns NotificationListResponse Successful Response
     * @throws ApiError
     */
    public static getMyNotificationsMeNotificationsGet(
        isRead?: (boolean | null),
        limit: number = 50,
        skip?: number,
    ): CancelablePromise<NotificationListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/notifications',
            query: {
                'is_read': isRead,
                'limit': limit,
                'skip': skip,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get My Notifications
     * Get current user's notifications list
     * @param isRead
     * @param limit
     * @param skip
     * @returns NotificationListResponse Successful Response
     * @throws ApiError
     */
    public static getMyNotificationsMeNotificationsGet1(
        isRead?: (boolean | null),
        limit: number = 50,
        skip?: number,
    ): CancelablePromise<NotificationListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/notifications',
            query: {
                'is_read': isRead,
                'limit': limit,
                'skip': skip,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mark My Notifications As Read
     * Mark current user's notifications as read
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static markMyNotificationsAsReadMeNotificationsMarkReadPatch(
        requestBody: NotificationMarkReadRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/me/notifications/mark-read',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mark My Notifications As Read
     * Mark current user's notifications as read
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static markMyNotificationsAsReadMeNotificationsMarkReadPatch1(
        requestBody: NotificationMarkReadRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/me/notifications/mark-read',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get My Interaction Stats
     * Get current user's interaction statistics
     * @returns InteractionStatsResponse Successful Response
     * @throws ApiError
     */
    public static getMyInteractionStatsMeStatsGet(): CancelablePromise<InteractionStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/stats',
        });
    }
    /**
     * Get My Interaction Stats
     * Get current user's interaction statistics
     * @returns InteractionStatsResponse Successful Response
     * @throws ApiError
     */
    public static getMyInteractionStatsMeStatsGet1(): CancelablePromise<InteractionStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/stats',
        });
    }
    /**
     * Get Content Like Stats
     * Get like statistics for content (public endpoint with optional user context)
     * @param contentId
     * @returns ContentLikeStatsResponse Successful Response
     * @throws ApiError
     */
    public static getContentLikeStatsContentsContentIdLikesStatsGet(
        contentId: string,
    ): CancelablePromise<ContentLikeStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/contents/{content_id}/likes/stats',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Content Like Stats
     * Get like statistics for content (public endpoint with optional user context)
     * @param contentId
     * @returns ContentLikeStatsResponse Successful Response
     * @throws ApiError
     */
    public static getContentLikeStatsContentsContentIdLikesStatsGet1(
        contentId: string,
    ): CancelablePromise<ContentLikeStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/contents/{content_id}/likes/stats',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Channel Subscription Stats
     * Get subscription statistics for channel (public endpoint with optional user context)
     * @param channelId
     * @returns ChannelSubscriptionStatsResponse Successful Response
     * @throws ApiError
     */
    public static getChannelSubscriptionStatsChannelsChannelIdSubscriptionsStatsGet(
        channelId: string,
    ): CancelablePromise<ChannelSubscriptionStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/channels/{channel_id}/subscriptions/stats',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Channel Subscription Stats
     * Get subscription statistics for channel (public endpoint with optional user context)
     * @param channelId
     * @returns ChannelSubscriptionStatsResponse Successful Response
     * @throws ApiError
     */
    public static getChannelSubscriptionStatsChannelsChannelIdSubscriptionsStatsGet1(
        channelId: string,
    ): CancelablePromise<ChannelSubscriptionStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/channels/{channel_id}/subscriptions/stats',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Like
     * Create like
     * @param requestBody
     * @returns LikeResponse Successful Response
     * @throws ApiError
     */
    public static createLikeLikesPost(
        requestBody: LikeCreateRequest,
    ): CancelablePromise<LikeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/likes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Like
     * Create like
     * @param requestBody
     * @returns LikeResponse Successful Response
     * @throws ApiError
     */
    public static createLikeLikesPost1(
        requestBody: LikeCreateRequest,
    ): CancelablePromise<LikeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/likes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Like
     * Remove like
     * @param contentId
     * @returns void
     * @throws ApiError
     */
    public static removeLikeLikesContentIdDelete(
        contentId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/likes/{content_id}',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Like
     * Remove like
     * @param contentId
     * @returns void
     * @throws ApiError
     */
    public static removeLikeLikesContentIdDelete1(
        contentId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/likes/{content_id}',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Subscription
     * Create subscription
     * @param requestBody
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public static createSubscriptionSubscriptionsPost(
        requestBody: SubscriptionCreateRequest,
    ): CancelablePromise<SubscriptionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Subscription
     * Create subscription
     * @param requestBody
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public static createSubscriptionSubscriptionsPost1(
        requestBody: SubscriptionCreateRequest,
    ): CancelablePromise<SubscriptionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/subscriptions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Subscription
     * Remove subscription
     * @param channelId
     * @returns void
     * @throws ApiError
     */
    public static removeSubscriptionSubscriptionsChannelIdDelete(
        channelId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/subscriptions/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Subscription
     * Remove subscription
     * @param channelId
     * @returns void
     * @throws ApiError
     */
    public static removeSubscriptionSubscriptionsChannelIdDelete1(
        channelId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/subscriptions/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Notification Admin
     * Create notification (admin only)
     * @param requestBody
     * @returns NotificationResponse Successful Response
     * @throws ApiError
     */
    public static createNotificationAdminAdminNotificationsPost(
        requestBody: NotificationCreateRequest,
    ): CancelablePromise<NotificationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/notifications',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Notification Admin
     * Create notification (admin only)
     * @param requestBody
     * @returns NotificationResponse Successful Response
     * @throws ApiError
     */
    public static createNotificationAdminAdminNotificationsPost1(
        requestBody: NotificationCreateRequest,
    ): CancelablePromise<NotificationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/notifications',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
