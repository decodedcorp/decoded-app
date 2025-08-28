/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Comment response schema
 */
export type CommentResponse = {
    /**
     * Comment ID
     */
    id: string;
    /**
     * Content ID
     */
    content_id: string;
    /**
     * Author user ID
     */
    author_id: string;
    /**
     * Comment text content
     */
    text: string;
    /**
     * Parent comment ID
     */
    parent_comment_id?: (string | null);
    /**
     * Number of likes
     */
    likes?: number;
    /**
     * Number of dislikes
     */
    dislikes?: number;
    /**
     * Number of replies
     */
    replies_count?: number;
    /**
     * Comment creation timestamp
     */
    created_at: string;
    /**
     * Whether comment has been edited
     */
    is_edited?: boolean;
};

