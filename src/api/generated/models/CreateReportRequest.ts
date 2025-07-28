/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportableItemType } from './ReportableItemType';
/**
 * Request schema for creating a report
 */
export type CreateReportRequest = {
    /**
     * Type of item being reported
     */
    reported_item_type: ReportableItemType;
    /**
     * ID of the item being reported
     */
    reported_item_id: string;
    /**
     * Reason for the report
     */
    reason: string;
};

