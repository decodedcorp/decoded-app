/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookmarkResponse } from './BookmarkResponse';
/**
 * Bookmark statistics response
 */
export type BookmarkStatsResponse = {
    /**
     * User ID
     */
    user_id: string;
    /**
     * Total bookmarks by user
     */
    total_bookmarks?: number;
    /**
     * Recent bookmarks
     */
    recent_bookmarks?: Array<BookmarkResponse>;
};

