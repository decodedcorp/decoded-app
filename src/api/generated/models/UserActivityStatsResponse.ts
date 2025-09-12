/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * User activity statistics response
 */
export type UserActivityStatsResponse = {
    /**
     * Number of channels owned by user
     */
    owned_channels: number;
    /**
     * Number of contents created by user
     */
    created_contents: number;
    /**
     * Number of channels subscribed to
     */
    subscriptions: number;
    /**
     * Number of contents bookmarked
     */
    bookmarks: number;
    /**
     * Number of comments written
     */
    comments: number;
    /**
     * Number of unread notifications (private)
     */
    unread_notifications?: (number | null);
    /**
     * Last update timestamp (private)
     */
    last_updated?: (string | null);
};

