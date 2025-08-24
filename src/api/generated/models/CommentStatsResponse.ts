/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentResponse } from './CommentResponse';
/**
 * Comment statistics response
 */
export type CommentStatsResponse = {
    /**
     * Content ID
     */
    content_id: string;
    /**
     * Total number of comments
     */
    total_comments?: number;
    /**
     * Number of top-level comments
     */
    top_level_comments?: number;
    /**
     * Number of replies
     */
    total_replies?: number;
    /**
     * Recent comments (24h)
     */
    recent_comments?: number;
    /**
     * Most liked comment
     */
    most_liked_comment?: (CommentResponse | null);
    /**
     * Most recent comment
     */
    most_recent_comment?: (CommentResponse | null);
};

