/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response for feed statistics
 */
export type FeedStatsResponse = {
    /**
     * Total feed items
     */
    total_items?: number;
    /**
     * Items grouped by type
     */
    items_by_type?: Record<string, number>;
    /**
     * Engagement statistics
     */
    engagement_stats?: Record<string, any>;
};

