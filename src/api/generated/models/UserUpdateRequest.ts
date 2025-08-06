/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
/**
 * Request to update user information
 */
export type UserUpdateRequest = {
    /**
     * New user role
     */
    role?: (UserRole | null);
    /**
     * Ban status
     */
    is_banned?: (boolean | null);
    /**
     * Admin notes for the user
     */
    admin_notes: (string | null);
};

