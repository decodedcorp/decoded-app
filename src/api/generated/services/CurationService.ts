/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddCuration } from '../models/AddCuration';
import type { Response } from '../models/Response';
import type { UpdateContents } from '../models/UpdateContents';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CurationService {
    /**
     * Get Contents
     * Get current featured content
     * @param contentType Content type (main_page/detail_page)
     * @param curationType Curation type (identity/brand/context)
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getContentsCurationContentsGet(
        contentType: string,
        curationType: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/curation/contents',
            query: {
                'content_type': contentType,
                'curation_type': curationType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Curation
     * @param requestBody
     * @param session
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static addCurationAdminUserDocIdCurationAddPost(
        requestBody: AddCuration,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/{user_doc_id}/curation/add',
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
     * Update Contents
     * Update featured content
     * @param requestBody
     * @param session
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static updateContentsAdminUserDocIdCurationContentsPatch(
        requestBody: UpdateContents,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/{user_doc_id}/curation/contents',
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
}
