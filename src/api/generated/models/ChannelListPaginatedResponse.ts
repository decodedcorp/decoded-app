/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminChannelResponse } from './AdminChannelResponse';
/**
 * Paginated response for channel listing
 */
export type ChannelListPaginatedResponse = {
    /**
     * List of channels
     */
    channels?: Array<AdminChannelResponse>;
    /**
     * Total number of channels
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

