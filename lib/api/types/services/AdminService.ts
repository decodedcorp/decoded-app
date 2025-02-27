/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfirmItemInfo } from '../models/ConfirmItemInfo';
import type { Response } from '../models/Response';
import type { UpdateItems } from '../models/UpdateItems';
import type { UploadBrand } from '../models/UploadBrand';
import type { UploadIdentity } from '../models/UploadIdentity';
import type { UploadImage } from '../models/UploadImage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
    /**
     * Upload Image
     * @param requestDocId The id of the request document
     * @param requestBody
     * @param session
     * @returns Response Image document added into the database
     * @throws ApiError
     */
    public static uploadImageAdminUserDocIdImageUploadRequestDocIdPost(
        requestDocId: string,
        requestBody: UploadImage,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/{user_doc_id}/image/upload/{request_doc_id}',
            path: {
                'request_doc_id': requestDocId,
            },
            query: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Items
     * @param imageDocId The id of the image document
     * @param requestBody
     * @param session
     * @returns Response Image document updated
     * @throws ApiError
     */
    public static addItemsAdminUserDocIdImageImageDocIdAddPatch(
        imageDocId: string,
        requestBody: UpdateItems,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/{user_doc_id}/image/{image_doc_id}/add',
            path: {
                'image_doc_id': imageDocId,
            },
            query: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirm Item Link
     * Confirm provided information(e.g link) of the item
     * @param itemDocId Item doc id
     * @param requestBody
     * @param session
     * @returns Response Confirm provided information of the item
     * @throws ApiError
     */
    public static confirmItemLinkAdminUserDocIdItemItemDocIdConfirmPost(
        itemDocId: string,
        requestBody: ConfirmItemInfo,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/{user_doc_id}/item/{item_doc_id}/confirm',
            path: {
                'item_doc_id': itemDocId,
            },
            query: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pending Items
     * @param nextId Next id to fetch
     * @returns Response Get list of items of which the links are not confirmed
     * @throws ApiError
     */
    public static getPendingItemsAdminUserDocIdItemPendingItemsGet(
        nextId?: (string | null),
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/item/pending-items',
            query: {
                'next_id': nextId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Request Documents
     * Get all request documents. Path of `user_doc_id` should be `admin`
     * @param docType Type of the requested document that is either 'identity' | 'image' | 'brand'
     * @param nextId The next id to query from
     * @returns Response Requests retrieved
     * @throws ApiError
     */
    public static getRequestDocumentsAdminUserDocIdRequestGet(
        docType: string,
        nextId?: (string | null),
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/request',
            query: {
                'doc_type': docType,
                'next_id': nextId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Request
     * @param requestDocId The id of the request document
     * @param session
     * @returns any Request deleted
     * @throws ApiError
     */
    public static deleteRequestAdminUserDocIdRequestDeleteRequestDocIdDelete(
        requestDocId: string,
        session?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/{user_doc_id}/request/delete/{request_doc_id}',
            path: {
                'request_doc_id': requestDocId,
            },
            query: {
                'session': session,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Brand Document
     * Upload brand document
     * @param requestBody
     * @param session
     * @returns Response Upload brand document successfully
     * @throws ApiError
     */
    public static uploadBrandDocumentAdminUserDocIdBrandUploadPost(
        requestBody: UploadBrand,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/{user_doc_id}/brand/upload',
            query: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Identity
     * Upload identity document
     * @param requestBody
     * @param session
     * @returns Response Identity document created
     * @throws ApiError
     */
    public static uploadIdentityAdminUserDocIdIdentityUploadPost(
        requestBody: UploadIdentity,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/{user_doc_id}/identity/upload',
            query: {
                'session': session,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Item Class
     * @param _new
     * @returns Response Add a new item class
     * @throws ApiError
     */
    public static addItemClassAdminUserDocIdCategoryAddItemClassPost(
        _new?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/{user_doc_id}/category/add/item-class',
            query: {
                'new': _new,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
