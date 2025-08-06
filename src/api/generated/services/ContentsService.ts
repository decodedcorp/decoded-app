/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentListResponse } from '../models/ContentListResponse';
import type { ContentStatus } from '../models/ContentStatus';
import type { ImageContentCreate } from '../models/ImageContentCreate';
import type { ImageContentResponse } from '../models/ImageContentResponse';
import type { ImageContentUpdate } from '../models/ImageContentUpdate';
import type { LinkContentCreate } from '../models/LinkContentCreate';
import type { LinkContentResponse } from '../models/LinkContentResponse';
import type { LinkContentUpdate } from '../models/LinkContentUpdate';
import type { VideoContentCreate } from '../models/VideoContentCreate';
import type { VideoContentResponse } from '../models/VideoContentResponse';
import type { VideoContentUpdate } from '../models/VideoContentUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContentsService {
    /**
     * Create Link Content
     * Create a new link content
     * @param requestBody
     * @returns LinkContentResponse Successful Response
     * @throws ApiError
     */
    public static createLinkContentContentsLinksPost(
        requestBody: LinkContentCreate,
    ): CancelablePromise<LinkContentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/contents/links',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Link Content
     * Get link content by ID - public endpoint
     * @param contentId
     * @returns LinkContentResponse Successful Response
     * @throws ApiError
     */
    public static getLinkContentContentsLinksContentIdGet(
        contentId: string,
    ): CancelablePromise<LinkContentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/contents/links/{content_id}',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Link Content
     * Update link content (provider only)
     * @param contentId
     * @param requestBody
     * @returns LinkContentResponse Successful Response
     * @throws ApiError
     */
    public static updateLinkContentContentsLinksContentIdPut(
        contentId: string,
        requestBody: LinkContentUpdate,
    ): CancelablePromise<LinkContentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/contents/links/{content_id}',
            path: {
                'content_id': contentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Link Content
     * Delete link content (provider only)
     * @param contentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteLinkContentContentsLinksContentIdDelete(
        contentId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/contents/links/{content_id}',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Image Content
     * Create a new image content
     * @param requestBody
     * @returns ImageContentResponse Successful Response
     * @throws ApiError
     */
    public static createImageContentContentsImagesPost(
        requestBody: ImageContentCreate,
    ): CancelablePromise<ImageContentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/contents/images',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Image Content
     * Get image content by ID - public endpoint
     * @param contentId
     * @returns ImageContentResponse Successful Response
     * @throws ApiError
     */
    public static getImageContentContentsImagesContentIdGet(
        contentId: string,
    ): CancelablePromise<ImageContentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/contents/images/{content_id}',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Image Content
     * Update image content (provider only)
     * @param contentId
     * @param requestBody
     * @returns ImageContentResponse Successful Response
     * @throws ApiError
     */
    public static updateImageContentContentsImagesContentIdPut(
        contentId: string,
        requestBody: ImageContentUpdate,
    ): CancelablePromise<ImageContentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/contents/images/{content_id}',
            path: {
                'content_id': contentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Image Content
     * Delete image content (provider only)
     * @param contentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteImageContentContentsImagesContentIdDelete(
        contentId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/contents/images/{content_id}',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Video Content
     * Create a new video content
     * @param requestBody
     * @returns VideoContentResponse Successful Response
     * @throws ApiError
     */
    public static createVideoContentContentsVideosPost(
        requestBody: VideoContentCreate,
    ): CancelablePromise<VideoContentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/contents/videos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Video Content
     * Get video content by ID - public endpoint
     * @param contentId
     * @returns VideoContentResponse Successful Response
     * @throws ApiError
     */
    public static getVideoContentContentsVideosContentIdGet(
        contentId: string,
    ): CancelablePromise<VideoContentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/contents/videos/{content_id}',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Video Content
     * Update video content (provider only)
     * @param contentId
     * @param requestBody
     * @returns VideoContentResponse Successful Response
     * @throws ApiError
     */
    public static updateVideoContentContentsVideosContentIdPut(
        contentId: string,
        requestBody: VideoContentUpdate,
    ): CancelablePromise<VideoContentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/contents/videos/{content_id}',
            path: {
                'content_id': contentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Video Content
     * Delete video content (provider only)
     * @param contentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteVideoContentContentsVideosContentIdDelete(
        contentId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/contents/videos/{content_id}',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Contents By Channel
     * Get all contents from a specific channel - public endpoint
     * @param channelId
     * @param skip
     * @param limit
     * @returns ContentListResponse Successful Response
     * @throws ApiError
     */
    public static getContentsByChannelContentsChannelChannelIdGet(
        channelId: string,
        skip?: number,
        limit: number = 20,
    ): CancelablePromise<ContentListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/contents/channel/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Contents By Provider
     * Get all contents from a specific provider - public endpoint
     * @param providerId
     * @param skip
     * @param limit
     * @returns ContentListResponse Successful Response
     * @throws ApiError
     */
    public static getContentsByProviderContentsProviderProviderIdGet(
        providerId: string,
        skip?: number,
        limit: number = 20,
    ): CancelablePromise<ContentListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/contents/provider/{provider_id}',
            path: {
                'provider_id': providerId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Contents By Status
     * Get all contents with a specific status - public endpoint
     * @param status
     * @param skip
     * @param limit
     * @returns ContentListResponse Successful Response
     * @throws ApiError
     */
    public static getContentsByStatusContentsStatusStatusGet(
        status: ContentStatus,
        skip?: number,
        limit: number = 20,
    ): CancelablePromise<ContentListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/contents/status/{status}',
            path: {
                'status': status,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
