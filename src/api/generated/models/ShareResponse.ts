/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Share response schema
 */
export type ShareResponse = {
    /**
     * Share ID
     */
    id: string;
    /**
     * Content ID
     */
    content_id: string;
    /**
     * User ID
     */
    user_id: string;
    /**
     * Share platform
     */
    platform: string;
    /**
     * Custom share message
     */
    message?: (string | null);
    /**
     * Views resulting from this share
     */
    resulted_in_views?: number;
    /**
     * Share timestamp
     */
    created_at: string;
};

