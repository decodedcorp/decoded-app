/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response showing who bookmarked a content
 */
export type ContentBookmarkResponse = {
    /**
     * Content ID
     */
    content_id: string;
    /**
     * Number of bookmarks for this content
     */
    bookmark_count?: number;
    /**
     * Recent user IDs who bookmarked this content
     */
    recent_bookmarkers?: Array<string>;
};

