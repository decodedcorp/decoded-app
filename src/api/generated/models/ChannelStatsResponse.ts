/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response for channel statistics
 */
export type ChannelStatsResponse = {
    /**
     * Total number of channels
     */
    total_channels?: number;
    /**
     * Number of active channels
     */
    active_channels?: number;
    /**
     * Number of suspended channels
     */
    suspended_channels?: number;
    /**
     * Channels grouped by content count
     */
    channels_by_content_count?: Record<string, number>;
};

