/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * View statistics response
 */
export type ViewStatsResponse = {
    /**
     * Content ID
     */
    content_id: string;
    /**
     * Total views
     */
    total_views?: number;
    /**
     * Unique views
     */
    unique_views?: number;
    /**
     * Anonymous views
     */
    anonymous_views?: number;
    /**
     * Recent views (24h)
     */
    recent_views?: number;
    /**
     * Average view duration in seconds
     */
    average_duration?: (number | null);
};

