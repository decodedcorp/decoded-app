/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentResponse } from './CommentResponse';
/**
 * Comment list response
 */
export type CommentListResponse = {
    /**
     * List of comments
     */
    comments: Array<CommentResponse>;
    /**
     * Total number of comments
     */
    total_count?: number;
    /**
     * Whether more comments are available
     */
    has_more?: boolean;
};

