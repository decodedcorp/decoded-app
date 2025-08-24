/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentType } from './ContentType';
/**
 * Individual feed item data structure
 */
export type FeedItemData = {
    /**
     * Content ID
     */
    id: string;
    /**
     * Type of content
     */
    content_type: ContentType;
    /**
     * Content title
     */
    title?: (string | null);
    /**
     * Content description
     */
    description?: (string | null);
    /**
     * Thumbnail URL
     */
    thumbnail_url?: (string | null);
    /**
     * Content URL
     */
    url: string;
    /**
     * Creation timestamp
     */
    created_at: string;
    /**
     * Number of likes
     */
    likes_count?: number;
    /**
     * Number of comments
     */
    comments_count?: number;
    /**
     * Content provider information
     */
    provider: Record<string, any>;
    /**
     * Channel information
     */
    channel: Record<string, any>;
    /**
     * Type-specific content data
     */
    content_data: Record<string, any>;
};

