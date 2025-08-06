/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationResponse } from './NotificationResponse';
/**
 * Notification list response
 */
export type NotificationListResponse = {
    /**
     * List of notifications
     */
    notifications: Array<NotificationResponse>;
    /**
     * Number of unread notifications
     */
    unread_count?: number;
    /**
     * Total number of notifications
     */
    total_count?: number;
    /**
     * Whether more notifications are available
     */
    has_more?: boolean;
};

