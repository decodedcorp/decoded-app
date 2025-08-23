/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Content folder response schema
 */
export type ContentFolderResponse = {
    /**
     * Folder ID
     */
    id: string;
    /**
     * Folder name
     */
    name: string;
    /**
     * Folder description
     */
    description?: (string | null);
    /**
     * Channel ID
     */
    channel_id: string;
    /**
     * Folder creator ID
     */
    creator_id: string;
    /**
     * Parent folder ID
     */
    parent_folder_id?: (string | null);
    /**
     * Number of contents in folder
     */
    content_count?: number;
    /**
     * Whether folder is pinned
     */
    is_pinned?: boolean;
    /**
     * Pin order
     */
    pin_order?: (number | null);
    /**
     * Folder color
     */
    color?: (string | null);
    created_at?: string;
    /**
     * Last update timestamp
     */
    updated_at?: (string | null);
};

