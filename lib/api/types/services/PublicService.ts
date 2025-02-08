/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Response } from '../models/Response';
import type { Response_GetDocumentResponse_ } from '../models/Response_GetDocumentResponse_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicService {
    /**
     * Health Check
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthCheckHealthGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Get Temp Token
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTempTokenTempTokenGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/temp-token',
        });
    }
    /**
     * Get Identity Categories
     * @returns Response Retrieve all identity categories
     * @throws ApiError
     */
    public static getIdentityCategoriesIdentityCategoriesGet(): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/identity/categories',
        });
    }
    /**
     * Get All Identity Documents With Pagination
     * Get all identity documents with pagination. If `next_id` is provided, it will return the next page of documents.
     * @param nextId The id of the next page
     * @returns Response All identity documents retrieved
     * @throws ApiError
     */
    public static getAllIdentityDocumentsWithPaginationIdentityGet(
        nextId?: (string | null),
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/identity',
            query: {
                'next_id': nextId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Single Identity Document
     * Get single identity document for given `id`
     * @param identityDocId
     * @returns Response Single identity document retrieved
     * @throws ApiError
     */
    public static getSingleIdentityDocumentIdentityIdentityDocIdGet(
        identityDocId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/identity/{identity_doc_id}',
            path: {
                'identity_doc_id': identityDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get All Brand Documents With Pagination
     * Get all brand documents with pagination. If `next_id` is provided, it will return the next page of documents.
     * @param nextId Id of the next page
     * @returns Response_GetDocumentResponse_ All Brand documents retrieved
     * @throws ApiError
     */
    public static getAllBrandDocumentsWithPaginationBrandGet(
        nextId?: (string | null),
    ): CancelablePromise<Response_GetDocumentResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/brand',
            query: {
                'next_id': nextId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Single Brand Document
     * Get single brand document for given `id`
     * @param brandDocId Brand doc id
     * @returns Response_GetDocumentResponse_ Brand documents retrieved
     * @throws ApiError
     */
    public static getSingleBrandDocumentBrandBrandDocIdGet(
        brandDocId: (string | null),
    ): CancelablePromise<Response_GetDocumentResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/brand/{brand_doc_id}',
            path: {
                'brand_doc_id': brandDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Image Context
     * Get image context
     * @returns Response Image context retrieved
     * @throws ApiError
     */
    public static getImageContextImageImageContextGet(): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/image/image-context',
        });
    }
    /**
     * Get Explore Images
     * Get explore images
     * @param of of which image to get
     * @param userDocId The id of the user document
     * @returns Response Explored images retrieved
     * @throws ApiError
     */
    public static getExploreImagesImageExploreGet(
        of: string = 'identity',
        userDocId?: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/image/explore',
            query: {
                'of': of,
                'user_doc_id': userDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get All Image Documents With Pagination
     * Get all image documents with pagination. If `next_id` is provided, it will return the next page of documents.
     * @param nextId The id of the next image document
     * @returns Response All image documents retrieved
     * @throws ApiError
     */
    public static getAllImageDocumentsWithPaginationImageGet(
        nextId?: (string | null),
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/image',
            query: {
                'next_id': nextId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Single Image Document
     * @param imageDocId The id of the image document
     * @returns Response Image retrieved
     * @throws ApiError
     */
    public static getSingleImageDocumentImageImageDocIdGet(
        imageDocId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/image/{image_doc_id}',
            path: {
                'image_doc_id': imageDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Related Images
     * Get related images for given `image_doc_id` and `artist_doc_id`
     * @param imageDocId The id of the image document
     * @param artistDocId The id of the artist document
     * @returns Response Related images retrieved
     * @throws ApiError
     */
    public static getRelatedImagesImageImageDocIdArtistArtistDocIdGet(
        imageDocId: string,
        artistDocId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/image/{image_doc_id}/artist/{artist_doc_id}',
            path: {
                'image_doc_id': imageDocId,
                'artist_doc_id': artistDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Link Labels
     * @returns Response Retrieve all link labels
     * @throws ApiError
     */
    public static getLinkLabelsItemLabelsGet(): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item/labels',
        });
    }
    /**
     * Get All Item Documents
     * @param nextId The id of the next item document
     * @returns Response Retrieve all item documents
     * @throws ApiError
     */
    public static getAllItemDocumentsItemGet(
        nextId?: (string | null),
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item',
            query: {
                'next_id': nextId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Single Item Document
     * @param itemDocId Item doc id
     * @returns Response Retrieve item information
     * @throws ApiError
     */
    public static getSingleItemDocumentItemItemDocIdGet(
        itemDocId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item/{item_doc_id}',
            path: {
                'item_doc_id': itemDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Related Items
     * @param brandDocId The id of the brand document
     * @returns Response Related items retrieved
     * @throws ApiError
     */
    public static getRelatedItemsItemRelatedBrandDocIdGet(
        brandDocId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item/related/{brand_doc_id}',
            path: {
                'brand_doc_id': brandDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Categories
     * @returns Response Get all categories
     * @throws ApiError
     */
    public static getCategoriesCategoryAllGet(): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/category/all',
        });
    }
    /**
     * Search
     * @param query
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchSearchGet(
        query: string = '',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search',
            query: {
                'query': query,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
