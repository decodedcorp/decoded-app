/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentFolderResponse } from './ContentFolderResponse';
/**
 * Content folder list response
 */
export type ContentFolderListResponse = {
    /**
     * List of folders
     */
    folders: Array<ContentFolderResponse>;
    /**
     * Total number of folders
     */
    total_count?: number;
    /**
     * Whether more folders are available
     */
    has_more?: boolean;
};

