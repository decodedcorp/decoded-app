/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentFolderCreate } from '../models/ContentFolderCreate';
import type { ContentFolderListResponse } from '../models/ContentFolderListResponse';
import type { ContentFolderResponse } from '../models/ContentFolderResponse';
import type { ContentFolderUpdate } from '../models/ContentFolderUpdate';
import type { FolderPinRequest } from '../models/FolderPinRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContentFoldersService {
    /**
     * Create Folder
     * Create a new content folder
     * @param requestBody
     * @returns ContentFolderResponse Successful Response
     * @throws ApiError
     */
    public static createFolderContentFoldersPost(
        requestBody: ContentFolderCreate,
    ): CancelablePromise<ContentFolderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/content-folders/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Folders
     * List folders with pagination and filtering
     * @param channelId Channel ID to list folders from
     * @param parentFolderId Parent folder ID to list subfolders
     * @param includePinnedOnly Show only pinned folders
     * @param page
     * @param limit
     * @param sortBy
     * @param sortOrder
     * @returns ContentFolderListResponse Successful Response
     * @throws ApiError
     */
    public static listFoldersContentFoldersGet(
        channelId: string,
        parentFolderId?: string,
        includePinnedOnly: boolean = false,
        page: number = 1,
        limit: number = 20,
        sortBy: string = 'name',
        sortOrder: string = 'asc',
    ): CancelablePromise<ContentFolderListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content-folders/',
            query: {
                'channel_id': channelId,
                'parent_folder_id': parentFolderId,
                'include_pinned_only': includePinnedOnly,
                'page': page,
                'limit': limit,
                'sort_by': sortBy,
                'sort_order': sortOrder,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Folder
     * Get folder information - public endpoint
     * @param folderId
     * @returns ContentFolderResponse Successful Response
     * @throws ApiError
     */
    public static getFolderContentFoldersFolderIdGet(
        folderId: string,
    ): CancelablePromise<ContentFolderResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content-folders/{folder_id}',
            path: {
                'folder_id': folderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Folder
     * Update folder information
     * @param folderId
     * @param requestBody
     * @returns ContentFolderResponse Successful Response
     * @throws ApiError
     */
    public static updateFolderContentFoldersFolderIdPut(
        folderId: string,
        requestBody: ContentFolderUpdate,
    ): CancelablePromise<ContentFolderResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/content-folders/{folder_id}',
            path: {
                'folder_id': folderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Folder
     * Delete folder
     * @param folderId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteFolderContentFoldersFolderIdDelete(
        folderId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/content-folders/{folder_id}',
            path: {
                'folder_id': folderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Pin Folder
     * Pin or unpin folder
     * @param folderId
     * @param requestBody
     * @returns ContentFolderResponse Successful Response
     * @throws ApiError
     */
    public static pinFolderContentFoldersFolderIdPinPatch(
        folderId: string,
        requestBody: FolderPinRequest,
    ): CancelablePromise<ContentFolderResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/content-folders/{folder_id}/pin',
            path: {
                'folder_id': folderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
