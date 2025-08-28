/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentResponse } from './CommentResponse';
/**
 * User comment statistics response
 */
export type UserCommentStatsResponse = {
    /**
     * User ID
     */
    user_id: string;
    /**
     * Total comments made by user
     */
    total_comments?: number;
    /**
     * Total likes received on comments
     */
    total_likes_received?: number;
    /**
     * Average likes per comment
     */
    average_likes_per_comment?: number;
    /**
     * User's most liked comment
     */
    most_liked_comment?: (CommentResponse | null);
};

