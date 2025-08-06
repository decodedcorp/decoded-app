/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminChannelResponse } from '../models/AdminChannelResponse';
import type { AdminUserResponse } from '../models/AdminUserResponse';
import type { ChannelListPaginatedResponse } from '../models/ChannelListPaginatedResponse';
import type { ChannelStatsResponse } from '../models/ChannelStatsResponse';
import type { ChannelUpdateRequest } from '../models/ChannelUpdateRequest';
import type { ReportableItemType } from '../models/ReportableItemType';
import type { ReportDetailResponse } from '../models/ReportDetailResponse';
import type { ReportListPaginatedResponse } from '../models/ReportListPaginatedResponse';
import type { ReportStatsResponse } from '../models/ReportStatsResponse';
import type { ReportStatus } from '../models/ReportStatus';
import type { ReportUpdateRequest } from '../models/ReportUpdateRequest';
import type { SystemConfigResponse } from '../models/SystemConfigResponse';
import type { SystemConfigUpdateRequest } from '../models/SystemConfigUpdateRequest';
import type { SystemStatsResponse } from '../models/SystemStatsResponse';
import type { UserListPaginatedResponse } from '../models/UserListPaginatedResponse';
import type { UserRole } from '../models/UserRole';
import type { UserStatsResponse } from '../models/UserStatsResponse';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
    /**
     * Get System Stats
     * Get comprehensive system statistics
     * @returns SystemStatsResponse Successful Response
     * @throws ApiError
     */
    public static getSystemStatsAdminUserDocIdAdminStatsGet(): CancelablePromise<SystemStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/admin/stats',
        });
    }
    /**
     * Get Reports
     * Get paginated list of reports with optional filters
     * @param page Page number
     * @param pageSize Items per page
     * @param statusFilter Filter by report status
     * @param itemTypeFilter Filter by reported item type
     * @returns ReportListPaginatedResponse Successful Response
     * @throws ApiError
     */
    public static getReportsAdminUserDocIdAdminReportsGet(
        page: number = 1,
        pageSize: number = 20,
        statusFilter?: (ReportStatus | null),
        itemTypeFilter?: (ReportableItemType | null),
    ): CancelablePromise<ReportListPaginatedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/admin/reports',
            query: {
                'page': page,
                'page_size': pageSize,
                'status_filter': statusFilter,
                'item_type_filter': itemTypeFilter,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Report Detail
     * Get detailed information for a specific report
     * @param reportId
     * @returns ReportDetailResponse Successful Response
     * @throws ApiError
     */
    public static getReportDetailAdminUserDocIdAdminReportsReportIdGet(
        reportId: string,
    ): CancelablePromise<ReportDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/admin/reports/{report_id}',
            path: {
                'report_id': reportId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Report
     * Update report status and admin notes
     * @param reportId
     * @param requestBody
     * @returns ReportDetailResponse Successful Response
     * @throws ApiError
     */
    public static updateReportAdminUserDocIdAdminReportsReportIdPut(
        reportId: string,
        requestBody: ReportUpdateRequest,
    ): CancelablePromise<ReportDetailResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/{user_doc_id}/admin/reports/{report_id}',
            path: {
                'report_id': reportId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Report Stats
     * Get report statistics
     * @returns ReportStatsResponse Successful Response
     * @throws ApiError
     */
    public static getReportStatsAdminUserDocIdAdminReportsStatsGet(): CancelablePromise<ReportStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/admin/reports/stats',
        });
    }
    /**
     * Get Channels
     * Get paginated list of channels
     * @param page Page number
     * @param pageSize Items per page
     * @returns ChannelListPaginatedResponse Successful Response
     * @throws ApiError
     */
    public static getChannelsAdminUserDocIdAdminChannelsGet(
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<ChannelListPaginatedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/admin/channels',
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Channel
     * Update channel information
     * @param channelId
     * @param requestBody
     * @returns AdminChannelResponse Successful Response
     * @throws ApiError
     */
    public static updateChannelAdminUserDocIdAdminChannelsChannelIdPut(
        channelId: string,
        requestBody: ChannelUpdateRequest,
    ): CancelablePromise<AdminChannelResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/{user_doc_id}/admin/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Channel
     * Delete a channel
     * @param channelId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteChannelAdminUserDocIdAdminChannelsChannelIdDelete(
        channelId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/{user_doc_id}/admin/channels/{channel_id}',
            path: {
                'channel_id': channelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Channel Stats
     * Get channel statistics
     * @returns ChannelStatsResponse Successful Response
     * @throws ApiError
     */
    public static getChannelStatsAdminUserDocIdAdminChannelsStatsGet(): CancelablePromise<ChannelStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/admin/channels/stats',
        });
    }
    /**
     * Get Users
     * Get paginated list of users
     * @param page Page number
     * @param pageSize Items per page
     * @param roleFilter Filter by user role
     * @returns UserListPaginatedResponse Successful Response
     * @throws ApiError
     */
    public static getUsersAdminUserDocIdAdminUsersGet(
        page: number = 1,
        pageSize: number = 20,
        roleFilter?: (UserRole | null),
    ): CancelablePromise<UserListPaginatedResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/admin/users',
            query: {
                'page': page,
                'page_size': pageSize,
                'role_filter': roleFilter,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * Update user information
     * @param userId
     * @param requestBody
     * @returns AdminUserResponse Successful Response
     * @throws ApiError
     */
    public static updateUserAdminUserDocIdAdminUsersUserIdPut(
        userId: string,
        requestBody: UserUpdateRequest,
    ): CancelablePromise<AdminUserResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/{user_doc_id}/admin/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Stats
     * Get user statistics
     * @returns UserStatsResponse Successful Response
     * @throws ApiError
     */
    public static getUserStatsAdminUserDocIdAdminUsersStatsGet(): CancelablePromise<UserStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/admin/users/stats',
        });
    }
    /**
     * Resolve Report
     * Mark a report as resolved
     * @param reportId
     * @param requestBody
     * @returns ReportDetailResponse Successful Response
     * @throws ApiError
     */
    public static resolveReportAdminUserDocIdAdminReportsReportIdResolvePost(
        reportId: string,
        requestBody?: (string | null),
    ): CancelablePromise<ReportDetailResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/{user_doc_id}/admin/reports/{report_id}/resolve',
            path: {
                'report_id': reportId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Dismiss Report
     * Mark a report as dismissed
     * @param reportId
     * @param requestBody
     * @returns ReportDetailResponse Successful Response
     * @throws ApiError
     */
    public static dismissReportAdminUserDocIdAdminReportsReportIdDismissPost(
        reportId: string,
        requestBody?: (string | null),
    ): CancelablePromise<ReportDetailResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/{user_doc_id}/admin/reports/{report_id}/dismiss',
            path: {
                'report_id': reportId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Promote User To Admin
     * Promote a user to admin role
     * @param userId
     * @returns AdminUserResponse Successful Response
     * @throws ApiError
     */
    public static promoteUserToAdminAdminUserDocIdAdminUsersUserIdPromotePost(
        userId: string,
    ): CancelablePromise<AdminUserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/{user_doc_id}/admin/users/{user_id}/promote',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Demote Admin To User
     * Demote an admin to regular user role
     * @param userId
     * @returns AdminUserResponse Successful Response
     * @throws ApiError
     */
    public static demoteAdminToUserAdminUserDocIdAdminUsersUserIdDemotePost(
        userId: string,
    ): CancelablePromise<AdminUserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/{user_doc_id}/admin/users/{user_id}/demote',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get System Config
     * Get system configuration
     * @returns SystemConfigResponse Successful Response
     * @throws ApiError
     */
    public static getSystemConfigAdminUserDocIdAdminConfigGet(): CancelablePromise<SystemConfigResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/{user_doc_id}/admin/config',
        });
    }
    /**
     * Update System Config
     * Update system configuration
     * @param requestBody
     * @returns SystemConfigResponse Successful Response
     * @throws ApiError
     */
    public static updateSystemConfigAdminUserDocIdAdminConfigPut(
        requestBody: SystemConfigUpdateRequest,
    ): CancelablePromise<SystemConfigResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/{user_doc_id}/admin/config',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
