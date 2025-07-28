/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportableItemType } from './ReportableItemType';
import type { ReportStatus } from './ReportStatus';
/**
 * Response schema for a report
 */
export type ReportResponse = {
    /**
     * Report ID
     */
    id: string;
    /**
     * Type of reported item
     */
    reported_item_type: ReportableItemType;
    /**
     * ID of reported item
     */
    reported_item_id: string;
    /**
     * Report reason
     */
    reason: string;
    /**
     * Report status
     */
    status: ReportStatus;
    /**
     * Report creation timestamp
     */
    created_at: string;
};

