/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Enhanced content interaction statistics with views and shares
 */
export type EnhancedContentInteractionStats = {
    /**
     * Content ID
     */
    content_id: string;
    /**
     * Total likes
     */
    likes_count?: number;
    /**
     * Total comments
     */
    comments_count?: number;
    /**
     * Total shares
     */
    shares_count?: number;
    /**
     * Total views
     */
    views_count?: number;
    /**
     * Unique views
     */
    unique_views_count?: number;
    /**
     * Engagement rate
     */
    engagement_rate?: number;
    /**
     * Share rate (shares/views)
     */
    share_rate?: number;
    /**
     * View to like conversion rate
     */
    view_to_like_rate?: number;
};

