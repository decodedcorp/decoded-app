/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationType } from './NotificationType';
/**
 * Notification response schema
 */
export type NotificationResponse = {
    /**
     * Notification ID
     */
    id: string;
    /**
     * User ID
     */
    user_id: string;
    /**
     * Type of notification
     */
    notification_type: NotificationType;
    /**
     * Notification title
     */
    title: string;
    /**
     * Notification content
     */
    content: string;
    /**
     * Whether notification is read
     */
    is_read?: boolean;
    /**
     * Notification creation timestamp
     */
    created_at: string;
    /**
     * Additional notification metadata
     */
    metadata?: (Record<string, any> | null);
};

