/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentCreateRequest } from '../models/CommentCreateRequest';
import type { CommentLikeRequest } from '../models/CommentLikeRequest';
import type { CommentLikeResponse } from '../models/CommentLikeResponse';
import type { CommentListResponse } from '../models/CommentListResponse';
import type { CommentResponse } from '../models/CommentResponse';
import type { CommentStatsResponse } from '../models/CommentStatsResponse';
import type { CommentUpdateRequest } from '../models/CommentUpdateRequest';
import type { UserCommentStatsResponse } from '../models/UserCommentStatsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommentsService {
    /**
     * Create Comment
     * Create a new comment on content.
     *
     * - **content_id**: ID of the content to comment on
     * - **text**: Comment text content (1-1000 characters)
     * - **parent_comment_id**: Optional parent comment ID for replies
     * @param contentId
     * @param requestBody
     * @returns CommentResponse Successful Response
     * @throws ApiError
     */
    public static createCommentCommentsContentContentIdPost(
        contentId: string,
        requestBody: CommentCreateRequest,
    ): CancelablePromise<CommentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/comments/content/{content_id}',
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
     * Get Comments By Content
     * Get comments for a specific content item.
     *
     * - **content_id**: ID of the content to get comments for
     * - **limit**: Number of comments to retrieve (1-100)
     * - **skip**: Number of comments to skip for pagination
     * - **include_replies**: Whether to include reply comments
     * - **sort_order**: Sort order - newest, oldest, or most_liked
     * - **parent_comment_id**: Filter by parent comment (for getting replies)
     * @param contentId
     * @param limit Number of comments to retrieve
     * @param skip Number of comments to skip
     * @param includeReplies Whether to include replies
     * @param sortOrder Sort order for comments
     * @param parentCommentId Filter by parent comment ID for replies
     * @returns CommentListResponse Successful Response
     * @throws ApiError
     */
    public static getCommentsByContentCommentsContentContentIdGet(
        contentId: string,
        limit: number = 20,
        skip?: number,
        includeReplies: boolean = true,
        sortOrder: string = 'newest',
        parentCommentId?: (string | null),
    ): CancelablePromise<CommentListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/content/{content_id}',
            path: {
                'content_id': contentId,
            },
            query: {
                'limit': limit,
                'skip': skip,
                'include_replies': includeReplies,
                'sort_order': sortOrder,
                'parent_comment_id': parentCommentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Comment
     * Get a specific comment by ID.
     *
     * - **comment_id**: ID of the comment to retrieve
     * @param commentId
     * @returns CommentResponse Successful Response
     * @throws ApiError
     */
    public static getCommentCommentsCommentIdGet(
        commentId: string,
    ): CancelablePromise<CommentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Comment
     * Update a comment's text content.
     *
     * - **comment_id**: ID of the comment to update
     * - **text**: Updated comment text content (1-1000 characters)
     *
     * Note: Only the comment author can update their own comments.
     * @param commentId
     * @param requestBody
     * @returns CommentResponse Successful Response
     * @throws ApiError
     */
    public static updateCommentCommentsCommentIdPut(
        commentId: string,
        requestBody: CommentUpdateRequest,
    ): CancelablePromise<CommentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/comments/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Comment
     * Delete a comment.
     *
     * - **comment_id**: ID of the comment to delete
     *
     * Note: Only the comment author can delete their own comments.
     * @param commentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteCommentCommentsCommentIdDelete(
        commentId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/comments/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Handle Comment Like
     * Handle comment like/dislike actions.
     *
     * - **comment_id**: ID of the comment to like/dislike
     * - **action**: Action to perform - like, dislike, unlike, or undislike
     * @param commentId
     * @param requestBody
     * @returns CommentLikeResponse Successful Response
     * @throws ApiError
     */
    public static handleCommentLikeCommentsCommentIdLikePost(
        commentId: string,
        requestBody: CommentLikeRequest,
    ): CancelablePromise<CommentLikeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/comments/{comment_id}/like',
            path: {
                'comment_id': commentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Comment Stats
     * Get comment statistics for a content item.
     *
     * - **content_id**: ID of the content to get comment stats for
     * @param contentId
     * @returns CommentStatsResponse Successful Response
     * @throws ApiError
     */
    public static getCommentStatsCommentsContentContentIdStatsGet(
        contentId: string,
    ): CancelablePromise<CommentStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/content/{content_id}/stats',
            path: {
                'content_id': contentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Comment Stats
     * Get comment statistics for a user.
     *
     * - **user_id**: ID of the user to get comment stats for
     * @param userId
     * @returns UserCommentStatsResponse Successful Response
     * @throws ApiError
     */
    public static getUserCommentStatsCommentsUsersUserIdStatsGet(
        userId: string,
    ): CancelablePromise<UserCommentStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/users/{user_id}/stats',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
