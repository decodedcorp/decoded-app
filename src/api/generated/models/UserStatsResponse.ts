/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response for user statistics
 */
export type UserStatsResponse = {
    /**
     * Total number of users
     */
    total_users?: number;
    /**
     * Number of active users
     */
    active_users?: number;
    /**
     * Number of banned users
     */
    banned_users?: number;
    /**
     * Users grouped by role
     */
    users_by_role?: Record<string, number>;
};

