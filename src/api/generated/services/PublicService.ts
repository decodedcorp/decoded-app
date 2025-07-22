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
     * Get All Identity Documents
     * Get all identity documents
     * @returns Response All identity documents retrieved
     * @throws ApiError
     */
    public static getAllIdentityDocumentsIdentityGet(): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/identity',
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
     * Get All Brand Documents
     * Get all brand documents
     * @returns Response_GetDocumentResponse_ All Brand documents retrieved
     * @throws ApiError
     */
    public static getAllBrandDocumentsBrandGet(): CancelablePromise<Response_GetDocumentResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/brand',
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
     * @param min The minimum number of images to return
     * @param max The maximum number of images to return
     * @param userDocId The id of the user document
     * @returns Response Explored images retrieved
     * @throws ApiError
     */
    public static getExploreImagesImageExploreGet(
        of: string = 'identity',
        min: number = 1,
        max: number = 5,
        userDocId?: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/image/explore',
            query: {
                'of': of,
                'min': min,
                'max': max,
                'user_doc_id': userDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Decoded Images
     * @returns Response Decoded images retrieved
     * @throws ApiError
     */
    public static getDecodedImagesImageDecodedGet(): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/image/decoded',
        });
    }
    /**
     * Get Trending Images
     * @returns Response Trending images retrieved
     * @throws ApiError
     */
    public static getTrendingImagesImageTrendingGet(): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/image/trending',
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
     * Get Selected Images
     * @param min The minimum number of images to return
     * @param max The maximum number of images to return
     * @returns Response Get DECODED selected images
     * @throws ApiError
     */
    public static getSelectedImagesImageSelectedImagesGet(
        min: number = 1,
        max: number = 5,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/image/selected-images',
            query: {
                'min': min,
                'max': max,
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
     * Get Mypage Home Data
     * @param userDocId The id of the user
     * @param nextId The next id of the mypage
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getMypageHomeDataUserUserDocIdMypageHomeGet(
        userDocId: string,
        nextId?: (string | null),
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/mypage/home',
            path: {
                'user_doc_id': userDocId,
            },
            query: {
                'next_id': nextId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Mypage Requests Data
     * @param userDocId The id of the user
     * @param nextId The next id of the mypage
     * @param limit The limit of the mypage
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getMypageRequestsDataUserUserDocIdMypageRequestsGet(
        userDocId: string,
        nextId?: (string | null),
        limit: number = 10,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/mypage/requests',
            path: {
                'user_doc_id': userDocId,
            },
            query: {
                'next_id': nextId,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Mypage Provides Data
     * @param userDocId The id of the user
     * @param nextId The next id of the mypage
     * @param limit The limit of the mypage
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getMypageProvidesDataUserUserDocIdMypageProvidesGet(
        userDocId: string,
        nextId?: (string | null),
        limit: number = 10,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/mypage/provides',
            path: {
                'user_doc_id': userDocId,
            },
            query: {
                'next_id': nextId,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Mypage Likes Image Data
     * @param userDocId The id of the user
     * @param nextId The next id of the mypage
     * @param limit The limit of the mypage
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getMypageLikesImageDataUserUserDocIdMypageLikesImageGet(
        userDocId: string,
        nextId?: (string | null),
        limit: number = 10,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/mypage/likes/image',
            path: {
                'user_doc_id': userDocId,
            },
            query: {
                'next_id': nextId,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Profile
     * @param userDocId The id of the user
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getUserProfileUserUserDocIdProfileGet(
        userDocId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/profile',
            path: {
                'user_doc_id': userDocId,
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
    public static getCategoriesCategoryGet(): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/category',
        });
    }
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
}
