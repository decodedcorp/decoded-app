/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Extended user profile response
 */
export type UserProfileResponse = {
    /**
     * User ID
     */
    id: string;
    /**
     * User email
     */
    email?: (string | null);
    /**
     * User alias/nickname
     */
    aka?: (string | null);
    /**
     * Sui blockchain address
     */
    sui_address?: (string | null);
    /**
     * Profile image URL
     */
    profile_image_url?: (string | null);
    /**
     * User registration timestamp
     */
    registration_date: string;
    /**
     * Last login timestamp
     */
    last_login?: (string | null);
    /**
     * Number of channels owned
     */
    total_channels?: number;
    /**
     * Total content created
     */
    total_content?: number;
    /**
     * Number of followers
     */
    total_followers?: number;
    /**
     * Number of users following
     */
    total_following?: number;
    /**
     * User verification status
     */
    is_verified?: boolean;
};

