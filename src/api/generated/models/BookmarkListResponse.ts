/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookmarkResponse } from './BookmarkResponse';
/**
 * Bookmark list response
 */
export type BookmarkListResponse = {
    /**
     * List of bookmarks
     */
    bookmarks: Array<BookmarkResponse>;
    /**
     * Total number of bookmarks
     */
    total_count?: number;
    /**
     * Whether more bookmarks are available
     */
    has_more?: boolean;
};

