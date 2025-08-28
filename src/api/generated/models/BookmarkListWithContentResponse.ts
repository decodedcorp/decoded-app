/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookmarkWithContentResponse } from './BookmarkWithContentResponse';
/**
 * Bookmark list response with content details
 */
export type BookmarkListWithContentResponse = {
    /**
     * List of bookmarks with content
     */
    bookmarks: Array<BookmarkWithContentResponse>;
    /**
     * Total number of bookmarks
     */
    total_count?: number;
    /**
     * Whether more bookmarks are available
     */
    has_more?: boolean;
};

