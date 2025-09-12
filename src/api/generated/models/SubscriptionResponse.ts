/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Subscription response schema
 */
export type SubscriptionResponse = {
    /**
     * Subscription ID
     */
    id: string;
    /**
     * Channel ID
     */
    channel_id: string;
    /**
     * Channel name
     */
    channel_name: string;
    /**
     * Channel thumbnail URL
     */
    channel_thumbnail_url?: (string | null);
    /**
     * Number of content items in channel
     */
    channel_content_count?: number;
    /**
     * Number of channel subscribers
     */
    channel_subscriber_count?: number;
    /**
     * Subscription creation timestamp
     */
    created_at: string;
    /**
     * Whether subscription is active
     */
    is_active?: boolean;
};

