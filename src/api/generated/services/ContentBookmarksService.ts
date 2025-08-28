/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentBookmarkResponse } from '../models/ContentBookmarkResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContentBookmarksService {
    /**
     * Get Content Bookmarks
     * Get bookmark information for a specific content
     * @param contentId ID of content to get bookmark info
     * @param limit Number of recent bookmarkers to include
     * @returns ContentBookmarkResponse Successful Response
     * @throws ApiError
     */
    public static getContentBookmarksContentContentIdBookmarksGet(
        contentId: string,
        limit: number = 10,
    ): CancelablePromise<ContentBookmarkResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/{content_id}/bookmarks',
            path: {
                'content_id': contentId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
