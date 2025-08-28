/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentPreviewMetadata } from './ContentPreviewMetadata';
import type { FolderPreviewMetadata } from './FolderPreviewMetadata';
/**
 * Unified response for pinned items (content or folder)
 */
export type UnifiedPinnedItem = {
    /**
     * Item ID
     */
    id: string;
    /**
     * Item type (content/folder)
     */
    type: string;
    /**
     * Item name/title
     */
    name: string;
    /**
     * Pin order
     */
    pin_order: number;
    /**
     * Pin record ID
     */
    pin_id: string;
    /**
     * Pin note
     */
    pin_note?: (string | null);
    /**
     * Item creation timestamp
     */
    created_at: string;
    /**
     * Pin timestamp
     */
    pinned_at: string;
    /**
     * Content type (for content items)
     */
    content_type?: (string | null);
    /**
     * Folder color (for folder items)
     */
    folder_color?: (string | null);
    /**
     * Content count (for folder items)
     */
    content_count?: (number | null);
    /**
     * Content preview metadata
     */
    content_metadata?: (ContentPreviewMetadata | null);
    /**
     * Folder preview metadata
     */
    folder_metadata?: (FolderPreviewMetadata | null);
};

