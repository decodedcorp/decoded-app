/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Content like statistics response
 */
export type ContentLikeStatsResponse = {
    /**
     * Content ID
     */
    content_id: string;
    /**
     * Total likes for this content
     */
    total_likes?: number;
    /**
     * Recent likes (24h)
     */
    recent_likes?: number;
    /**
     * Like trend (increasing/decreasing/stable)
     */
    like_trend: string;
    /**
     * Top users who liked this content
     */
    top_likers?: Array<Record<string, any>>;
};

