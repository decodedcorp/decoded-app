/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelPinsResponse } from '../models/ChannelPinsResponse';
import type { PinCreateRequest } from '../models/PinCreateRequest';
import type { PinReorderRequest } from '../models/PinReorderRequest';
import type { PinResponse } from '../models/PinResponse';
import type { PinTargetType } from '../models/PinTargetType';
import type { UnifiedChannelPinsResponse } from '../models/UnifiedChannelPinsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PinsService {
    /**
     * Create Pin
     * Create a new pin
     * @param requestBody
     * @returns PinResponse Successful Response
     * @throws ApiError
     */
    public static createPinPinsPost(
        requestBody: PinCreateRequest,
    ): CancelablePromise<PinResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pins/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Pin
     * Delete a pin by target
     * @param channelId
     * @param targetType
     * @param targetId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deletePinPinsChannelsChannelIdTargetTypeTargetIdDelete(
        channelId: string,
        targetType: PinTargetType,
        targetId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/pins/channels/{channel_id}/{target_type}/{target_id}',
            path: {
                'channel_id': channelId,
                'target_type': targetType,
                'target_id': targetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Channel Pins
     * List channel pins with pagination and filtering
     * @param channelId
     * @param targetType Filter by pin target type
     * @param page
     * @param limit
     * @param includeTargetDetails Include target object details
     * @returns ChannelPinsResponse Successful Response
     * @throws ApiError
     */
    public static listChannelPinsPinsChannelsChannelIdGet(
        channelId: string,
        targetType?: PinTargetType,
        page: number = 1,
        limit: number = 20,
        includeTargetDetails: boolean = true,
    ): CancelablePromise<ChannelPinsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pins/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            query: {
                'target_type': targetType,
                'page': page,
                'limit': limit,
                'include_target_details': includeTargetDetails,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Unified Channel Pins
     * Get unified list of pinned items (content and folders) for a channel
     * @param channelId
     * @param page
     * @param limit
     * @returns UnifiedChannelPinsResponse Successful Response
     * @throws ApiError
     */
    public static getUnifiedChannelPinsPinsChannelsChannelIdUnifiedGet(
        channelId: string,
        page: number = 1,
        limit: number = 20,
    ): CancelablePromise<UnifiedChannelPinsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pins/channels/{channel_id}/unified',
            path: {
                'channel_id': channelId,
            },
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reorder Pins
     * Reorder pins within a channel
     * @param channelId
     * @param requestBody
     * @returns PinResponse Successful Response
     * @throws ApiError
     */
    public static reorderPinsPinsChannelsChannelIdReorderPatch(
        channelId: string,
        requestBody: PinReorderRequest,
    ): CancelablePromise<Array<PinResponse>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/pins/channels/{channel_id}/reorder',
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
     * Pin Content
     * Quick pin content
     * @param contentId
     * @param channelId Channel ID
     * @param pinOrder Pin order
     * @returns PinResponse Successful Response
     * @throws ApiError
     */
    public static pinContentPinsContentContentIdPinPost(
        contentId: string,
        channelId: string,
        pinOrder?: number,
    ): CancelablePromise<PinResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pins/content/{content_id}/pin',
            path: {
                'content_id': contentId,
            },
            query: {
                'channel_id': channelId,
                'pin_order': pinOrder,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unpin Content
     * Quick unpin content
     * @param contentId
     * @param channelId Channel ID
     * @returns any Successful Response
     * @throws ApiError
     */
    public static unpinContentPinsContentContentIdPinDelete(
        contentId: string,
        channelId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/pins/content/{content_id}/pin',
            path: {
                'content_id': contentId,
            },
            query: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Pin Folder
     * Quick pin folder
     * @param folderId
     * @param channelId Channel ID
     * @param pinOrder Pin order
     * @returns PinResponse Successful Response
     * @throws ApiError
     */
    public static pinFolderPinsFolderFolderIdPinPost(
        folderId: string,
        channelId: string,
        pinOrder?: number,
    ): CancelablePromise<PinResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pins/folder/{folder_id}/pin',
            path: {
                'folder_id': folderId,
            },
            query: {
                'channel_id': channelId,
                'pin_order': pinOrder,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unpin Folder
     * Quick unpin folder
     * @param folderId
     * @param channelId Channel ID
     * @returns any Successful Response
     * @throws ApiError
     */
    public static unpinFolderPinsFolderFolderIdPinDelete(
        folderId: string,
        channelId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/pins/folder/{folder_id}/pin',
            path: {
                'folder_id': folderId,
            },
            query: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
