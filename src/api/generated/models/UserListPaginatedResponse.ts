/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserListResponse } from './UserListResponse';
/**
 * Paginated response for user listing
 */
export type UserListPaginatedResponse = {
    /**
     * List of users
     */
    users?: Array<UserListResponse>;
    /**
     * Total number of users
     */
    total?: number;
    /**
     * Current page number
     */
    page?: number;
    /**
     * Number of items per page
     */
    page_size?: number;
    /**
     * Total number of pages
     */
    total_pages?: number;
};

