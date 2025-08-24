/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookmarkListResponse } from '../models/BookmarkListResponse';
import type { BookmarkResponse } from '../models/BookmarkResponse';
import type { BookmarkStatsResponse } from '../models/BookmarkStatsResponse';
import type { BookmarkStatusResponse } from '../models/BookmarkStatusResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BookmarksService {
    /**
     * Add Bookmark
     * Add a bookmark for the current user
     * @param contentId ID of content to bookmark
     * @returns BookmarkResponse Successful Response
     * @throws ApiError
     */
    public static addBookmarkUsersMeBookmarksContentIdPost(
        contentId: string,
    ): CancelablePromise<BookmarkResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/me/bookmarks/{content_id}',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Bookmark
     * Remove a bookmark for the current user
     * @param contentId ID of content to remove from bookmarks
     * @returns any Successful Response
     * @throws ApiError
     */
    public static removeBookmarkUsersMeBookmarksContentIdDelete(
        contentId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/me/bookmarks/{content_id}',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Bookmarks
     * Get current user's bookmarks with pagination
     * @param offset Offset for pagination
     * @param limit Number of bookmarks to return
     * @returns BookmarkListResponse Successful Response
     * @throws ApiError
     */
    public static getBookmarksUsersMeBookmarksGet(
        offset?: number,
        limit: number = 20,
    ): CancelablePromise<BookmarkListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/bookmarks',
            query: {
                'offset': offset,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Check Bookmark Status
     * Check if content is bookmarked by current user
     * @param contentId ID of content to check bookmark status
     * @returns BookmarkStatusResponse Successful Response
     * @throws ApiError
     */
    public static checkBookmarkStatusUsersMeBookmarksContentIdStatusGet(
        contentId: string,
    ): CancelablePromise<BookmarkStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/bookmarks/{content_id}/status',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Bookmark Stats
     * Get bookmark statistics for current user
     * @param recentLimit Number of recent bookmarks to include
     * @returns BookmarkStatsResponse Successful Response
     * @throws ApiError
     */
    public static getBookmarkStatsUsersMeBookmarksStatsGet(
        recentLimit: number = 5,
    ): CancelablePromise<BookmarkStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/bookmarks/stats',
            query: {
                'recent_limit': recentLimit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
