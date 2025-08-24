/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Comment creation request
 */
export type CommentCreateRequest = {
    /**
     * Comment text content
     */
    text: string;
    /**
     * Parent comment ID for replies
     */
    parent_comment_id?: (string | null);
};

