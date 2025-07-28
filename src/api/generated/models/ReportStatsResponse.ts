/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response for report statistics
 */
export type ReportStatsResponse = {
    /**
     * Total number of reports
     */
    total_reports?: number;
    /**
     * Number of pending reports
     */
    pending_reports?: number;
    /**
     * Number of resolved reports
     */
    resolved_reports?: number;
    /**
     * Number of dismissed reports
     */
    dismissed_reports?: number;
    /**
     * Reports grouped by type
     */
    reports_by_type?: Record<string, number>;
};

