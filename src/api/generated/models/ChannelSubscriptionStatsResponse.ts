/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Channel subscription statistics response
 */
export type ChannelSubscriptionStatsResponse = {
    /**
     * Channel ID
     */
    channel_id: string;
    /**
     * Total subscribers
     */
    total_subscribers?: number;
    /**
     * New subscribers (24h)
     */
    new_subscribers?: number;
    /**
     * Subscription trend (growing/declining/stable)
     */
    subscription_trend: string;
    /**
     * Subscriber engagement metrics
     */
    subscriber_engagement?: Record<string, any>;
};

