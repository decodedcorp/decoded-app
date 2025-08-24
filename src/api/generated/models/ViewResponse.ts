/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * View response schema
 */
export type ViewResponse = {
    /**
     * View ID
     */
    id: string;
    /**
     * Content ID
     */
    content_id: string;
    /**
     * User ID (null for anonymous views)
     */
    user_id?: (string | null);
    /**
     * Session ID
     */
    session_id?: (string | null);
    /**
     * Whether this was a unique view
     */
    is_unique: boolean;
    /**
     * View duration in seconds
     */
    duration_seconds?: (number | null);
    /**
     * View timestamp
     */
    created_at: string;
};

