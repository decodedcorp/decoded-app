/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response for admin channel management
 */
export type AdminChannelResponse = {
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
     * Channel owner ID
     */
    owner_id: string;
    /**
     * Channel owner email
     */
    owner_email?: (string | null);
    /**
     * List of manager IDs
     */
    manager_ids?: Array<string>;
    /**
     * Channel thumbnail URL
     */
    thumbnail_url?: (string | null);
    /**
     * Total content in channel
     */
    total_contents?: number;
    /**
     * Channel active status
     */
    is_active?: boolean;
    /**
     * Channel creation time
     */
    created_at: string;
    /**
     * Channel last update time
     */
    updated_at: string;
};

