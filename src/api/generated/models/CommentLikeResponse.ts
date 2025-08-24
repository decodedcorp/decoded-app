/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Comment like response
 */
export type CommentLikeResponse = {
    /**
     * Comment ID
     */
    comment_id: string;
    /**
     * Action that was performed
     */
    action_performed: string;
    /**
     * New likes count
     */
    new_likes_count?: number;
    /**
     * New dislikes count
     */
    new_dislikes_count?: number;
    /**
     * Whether user has liked this comment
     */
    user_liked?: boolean;
    /**
     * Whether user has disliked this comment
     */
    user_disliked?: boolean;
};

