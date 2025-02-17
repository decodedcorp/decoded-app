/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationDoc } from '../models/NotificationDoc';
import type { ProvideItem } from '../models/ProvideItem';
import type { RequestAddItem } from '../models/RequestAddItem';
import type { RequestImage } from '../models/RequestImage';
import type { Response } from '../models/Response';
import type { UpdateOptionalAgreement } from '../models/UpdateOptionalAgreement';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProtectedService {
    /**
     * Request Image Upload
     * @param requestBody
     * @param session
     * @returns Response Image has been requested
     * @throws ApiError
     */
    public static requestImageUploadUserUserDocIdImageRequestPost(
        requestBody: RequestImage,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/{user_doc_id}/image/request',
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
     * Request Add Item
     * Request additional items for given `image_doc_id`
     * @param imageDocId The id of the image document
     * @param requestBody
     * @param session
     * @returns Response Additional item has been requested successfully
     * @throws ApiError
     */
    public static requestAddItemUserUserDocIdImageImageDocIdRequestAddPost(
        imageDocId: string,
        requestBody: RequestAddItem,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/{user_doc_id}/image/{image_doc_id}/request/add',
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
     * Provide Item
     * Provide item info for given `image_doc_id` and `item_doc_id`
     * @param imageDocId The id of the image document
     * @param itemDocId The id of the item document
     * @param requestBody
     * @param session
     * @returns Response Item provided
     * @throws ApiError
     */
    public static provideItemUserUserDocIdImageImageDocIdProvideItemItemDocIdPost(
        imageDocId: string,
        itemDocId: string,
        requestBody: ProvideItem,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/{user_doc_id}/image/{image_doc_id}/provide/item/{item_doc_id}',
            path: {
                'image_doc_id': imageDocId,
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
     * Get Item Requests
     * Get all item requests of a user
     * @param userDocId The id of the user
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getItemRequestsUserUserDocIdRequestsGet(
        userDocId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/requests',
            path: {
                'user_doc_id': userDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Like Item
     * @param userDocId The id of the user
     * @param itemDocId The id of the item
     * @param session
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static likeItemUserUserDocIdLikeItemItemDocIdPost(
        userDocId: string,
        itemDocId: string,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/{user_doc_id}/like/item/{item_doc_id}',
            path: {
                'user_doc_id': userDocId,
                'item_doc_id': itemDocId,
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
     * Unlike Item
     * @param userDocId The id of the user
     * @param itemDocId The id of the item
     * @param session
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static unlikeItemUserUserDocIdUnlikeItemItemDocIdPost(
        userDocId: string,
        itemDocId: string,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/{user_doc_id}/unlike/item/{item_doc_id}',
            path: {
                'user_doc_id': userDocId,
                'item_doc_id': itemDocId,
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
     * Like Image
     * @param userDocId The id of the user
     * @param imageDocId The id of the image
     * @param session
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static likeImageUserUserDocIdLikeImageImageDocIdPost(
        userDocId: string,
        imageDocId: string,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/{user_doc_id}/like/image/{image_doc_id}',
            path: {
                'user_doc_id': userDocId,
                'image_doc_id': imageDocId,
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
     * Unlike Image
     * @param userDocId The id of the user
     * @param imageDocId The id of the image
     * @param session
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static unlikeImageUserUserDocIdUnlikeImageImageDocIdPost(
        userDocId: string,
        imageDocId: string,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/{user_doc_id}/unlike/image/{image_doc_id}',
            path: {
                'user_doc_id': userDocId,
                'image_doc_id': imageDocId,
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
     * Get Is Like
     * @param userDocId The id of the user
     * @param docType The type of the document
     * @param docId Document id
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getIsLikeUserUserDocIdIslikeGet(
        userDocId: string,
        docType: string,
        docId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/islike',
            path: {
                'user_doc_id': userDocId,
            },
            query: {
                'doc_type': docType,
                'doc_id': docId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Is Request
     * @param userDocId The id of the user
     * @param imageDocId The id of the image
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getIsRequestUserUserDocIdIsRequestImageDocIdGet(
        userDocId: string,
        imageDocId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/is-request/{image_doc_id}',
            path: {
                'user_doc_id': userDocId,
                'image_doc_id': imageDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Is Provide
     * @param userDocId The id of the user
     * @param imageDocId The id of the image
     * @param itemDocId The id of the item
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getIsProvideUserUserDocIdIsProvideGet(
        userDocId: string,
        imageDocId: string,
        itemDocId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/is-provide',
            path: {
                'user_doc_id': userDocId,
            },
            query: {
                'image_doc_id': imageDocId,
                'item_doc_id': itemDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Aka
     * @param userDocId The id of the user
     * @param aka The alias of the user
     * @param session
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static setAkaUserUserDocIdAkaAkaPatch(
        userDocId: string,
        aka: string,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/{user_doc_id}/aka/{aka}',
            path: {
                'user_doc_id': userDocId,
                'aka': aka,
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
     * Update Optional Agreement
     * @param userDocId The id of the user
     * @param requestBody
     * @param session
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static updateOptionalAgreementUserUserDocIdUpdateAgreementPatch(
        userDocId: string,
        requestBody: UpdateOptionalAgreement,
        session?: any,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/{user_doc_id}/update-agreement',
            path: {
                'user_doc_id': userDocId,
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
     * Get Mypage Likes Item Data
     * @param userDocId The id of the user
     * @param nextId The next id of the mypage
     * @param limit The limit of the mypage
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getMypageLikesItemDataUserUserDocIdMypageLikesItemGet(
        userDocId: string,
        nextId?: (string | null),
        limit: number = 10,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/mypage/likes/item',
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
     * Get Mypage Notifications Data
     * @param userDocId The id of the user
     * @param nextId The next id of the mypage
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getMypageNotificationsDataUserUserDocIdMypageNotificationsGet(
        userDocId: string,
        nextId?: (string | null),
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/mypage/notifications',
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
     * Get Pending Requests
     * @param userDocId The id of the user
     * @param nextId The next id of the mypage
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getPendingRequestsUserUserDocIdPendingRequestsGet(
        userDocId: string,
        nextId?: (string | null),
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/pending-requests',
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
     * Get Pending Provides
     * @param userDocId The id of the user
     * @param nextId The next id of the mypage
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getPendingProvidesUserUserDocIdPendingProvidesGet(
        userDocId: string,
        nextId?: (string | null),
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/pending-provides',
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
     * Get Notifications
     * @param userDocId User document id
     * @param skip Skip count
     * @param limit Limit count
     * @param unreadOnly Only get unread notifications
     * @returns NotificationDoc Successful Response
     * @throws ApiError
     */
    public static getNotificationsUserUserDocIdNotificationGet(
        userDocId: string,
        skip?: number,
        limit: number = 20,
        unreadOnly: boolean = false,
    ): CancelablePromise<Array<NotificationDoc>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/notification',
            path: {
                'user_doc_id': userDocId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'unread_only': unreadOnly,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mark As Read
     * @param notificationId Notification ID
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static markAsReadUserUserDocIdNotificationNotificationIdReadPost(
        notificationId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/{user_doc_id}/notification/{notification_id}/read',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Unread Count
     * @param userDocId User document id
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static getUnreadCountUserUserDocIdNotificationUnreadCountGet(
        userDocId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_doc_id}/notification/unread-count',
            path: {
                'user_doc_id': userDocId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
