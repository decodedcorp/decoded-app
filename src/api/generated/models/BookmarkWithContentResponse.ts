/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentPreviewResponse } from './ContentPreviewResponse';
/**
 * Bookmark response with content details
 */
export type BookmarkWithContentResponse = {
    /**
     * ID of bookmarked content
     */
    content_id: string;
    /**
     * When bookmark was created
     */
    bookmark_created_at: string;
    /**
     * Content details
     */
    content?: (ContentPreviewResponse | null);
};

