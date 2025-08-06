/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportListResponse } from './ReportListResponse';
/**
 * Paginated response for report listing
 */
export type ReportListPaginatedResponse = {
    /**
     * List of reports
     */
    reports?: Array<ReportListResponse>;
    /**
     * Total number of reports
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

