/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Share statistics response
 */
export type ShareStatsResponse = {
    /**
     * Content ID
     */
    content_id: string;
    /**
     * Total shares
     */
    total_shares?: number;
    /**
     * Shares by platform
     */
    platform_breakdown?: Record<string, any>;
    /**
     * Recent shares (24h)
     */
    recent_shares?: number;
    /**
     * Total views from shares
     */
    total_resulting_views?: number;
};

