/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Trending content item
 */
export type TrendingContentItem = {
    /**
     * Content ID
     */
    id: string;
    /**
     * Content type (link/image/video)
     */
    type: string;
    /**
     * Content title
     */
    title?: (string | null);
    /**
     * Content description
     */
    description?: (string | null);
    /**
     * Content URL
     */
    url?: (string | null);
    /**
     * Thumbnail URL
     */
    thumbnail_url?: (string | null);
    /**
     * Channel ID
     */
    channel_id: string;
    /**
     * Channel name
     */
    channel_name: string;
    /**
     * Provider ID
     */
    provider_id: string;
};

