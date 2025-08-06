/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReportRequest } from '../models/CreateReportRequest';
import type { ReportResponse } from '../models/ReportResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportsService {
    /**
     * Create Report
     * Create a new report
     * @param requestBody
     * @returns ReportResponse Successful Response
     * @throws ApiError
     */
    public static createReportReportsPost(
        requestBody: CreateReportRequest,
    ): CancelablePromise<ReportResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reports/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get My Reports
     * Get all reports made by the current user
     * @returns ReportResponse Successful Response
     * @throws ApiError
     */
    public static getMyReportsReportsMyReportsGet(): CancelablePromise<Array<ReportResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reports/my-reports',
        });
    }
}
