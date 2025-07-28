/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicService {
    /**
     * Search
     * @param query
     * @param nextId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchSearchGet(
        query: string = '',
        nextId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search',
            query: {
                'query': query,
                'next_id': nextId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
