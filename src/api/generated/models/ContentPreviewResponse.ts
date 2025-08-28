/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Content preview for bookmark response
 */
export type ContentPreviewResponse = {
    /**
     * Content ID
     */
    id: string;
    /**
     * Content URL
     */
    url: string;
    /**
     * Content description
     */
    description?: (string | null);
    /**
     * Provider user ID
     */
    provider_id: string;
    /**
     * Provider username
     */
    provider_name?: (string | null);
    /**
     * Channel ID
     */
    channel_id: string;
    /**
     * Channel name
     */
    channel_name?: (string | null);
    /**
     * Content status
     */
    status: string;
    /**
     * Number of likes
     */
    likes?: number;
    /**
     * Number of comments
     */
    comments_count?: number;
    /**
     * Number of shares
     */
    shares_count?: number;
    /**
     * Number of views
     */
    views_count?: number;
    /**
     * Content category
     */
    category?: (string | null);
    /**
     * Link preview title
     */
    link_preview_title?: (string | null);
    /**
     * Link preview description
     */
    link_preview_description?: (string | null);
    /**
     * Link preview image URL
     */
    link_preview_img_url?: (string | null);
    /**
     * Link preview site name
     */
    link_preview_site_name?: (string | null);
    /**
     * Number of tagged items
     */
    tagged_items_count?: (number | null);
    /**
     * Video title
     */
    video_title?: (string | null);
    /**
     * Video thumbnail URL
     */
    thumbnail_url?: (string | null);
    /**
     * Video duration in seconds
     */
    duration_seconds?: (number | null);
    /**
     * Type of content (link/image/video)
     */
    content_type: string;
    /**
     * When content was created
     */
    created_at: string;
};

