/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
/**
 * Response for admin user management
 */
export type AdminUserResponse = {
    /**
     * User ID
     */
    id: string;
    /**
     * User email
     */
    email?: (string | null);
    /**
     * User role
     */
    role: UserRole;
    /**
     * User ban status
     */
    is_banned?: boolean;
    /**
     * User registration date
     */
    registration_date: string;
    /**
     * Last login time
     */
    last_login?: (string | null);
    /**
     * Total content created
     */
    total_content?: number;
    /**
     * Total reports against user
     */
    total_reports_received?: number;
};

