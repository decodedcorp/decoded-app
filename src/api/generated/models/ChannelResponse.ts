/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserProfileResponse } from './UserProfileResponse';
/**
 * Channel response schema
 */
export type ChannelResponse = {
    /**
     * Channel ID
     */
    id: string;
    /**
     * Channel name
     */
    name: string;
    /**
     * Channel description
     */
    description?: (string | null);
    /**
     * Channel owner user ID
     */
    owner_id: string;
    /**
     * Channel managers with full profile info
     */
    managers?: Array<UserProfileResponse>;
    /**
     * List of manager user IDs for quick access
     */
    manager_ids?: Array<string>;
    /**
     * Channel thumbnail URL
     */
    thumbnail_url?: (string | null);
    /**
     * Channel banner URL
     */
    banner_url?: (string | null);
    /**
     * Number of subscribers
     */
    subscriber_count?: number;
    /**
     * Number of content items
     */
    content_count?: number;
    created_at?: string;
    /**
     * Channel last update timestamp
     */
    updated_at?: (string | null);
    /**
     * Whether current user is subscribed
     */
    is_subscribed?: boolean;
    /**
     * Whether current user is the channel owner
     */
    is_owner?: boolean;
    /**
     * Whether current user is a channel manager
     */
    is_manager?: boolean;
};

