/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Channel like statistics response
 */
export type ChannelLikeStatsResponse = {
    /**
     * Channel ID
     */
    channel_id: string;
    /**
     * Total likes for this channel
     */
    total_likes?: number;
    /**
     * Recent likes (24h)
     */
    recent_likes?: number;
    /**
     * Whether current user has liked this channel
     */
    is_liked?: boolean;
};

