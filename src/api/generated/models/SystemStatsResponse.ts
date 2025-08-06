/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelStatsResponse } from './ChannelStatsResponse';
import type { ReportStatsResponse } from './ReportStatsResponse';
import type { UserStatsResponse } from './UserStatsResponse';
/**
 * Response for system statistics
 */
export type SystemStatsResponse = {
    /**
     * User statistics
     */
    users: UserStatsResponse;
    /**
     * Channel statistics
     */
    channels: ChannelStatsResponse;
    /**
     * Report statistics
     */
    reports: ReportStatsResponse;
};

