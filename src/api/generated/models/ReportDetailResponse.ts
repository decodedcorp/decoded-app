/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportableItemType } from './ReportableItemType';
import type { ReportStatus } from './ReportStatus';
/**
 * Response for detailed report information
 */
export type ReportDetailResponse = {
    /**
     * Report ID
     */
    id: string;
    /**
     * Reporter user ID
     */
    reporter_id: string;
    /**
     * Reporter email
     */
    reporter_email?: (string | null);
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
     * Admin notes for the report
     */
    admin_notes?: (string | null);
    /**
     * Report creation time
     */
    created_at: string;
    /**
     * Report last update time
     */
    updated_at: string;
};

