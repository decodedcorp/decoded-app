/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportStatus } from './ReportStatus';
/**
 * Request to update a report
 */
export type ReportUpdateRequest = {
    /**
     * New report status
     */
    status?: (ReportStatus | null);
    /**
     * Admin notes for the report
     */
    admin_notes: (string | null);
};

