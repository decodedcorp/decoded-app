/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationType } from './NotificationType';
/**
 * Notification creation request
 */
export type NotificationCreateRequest = {
    /**
     * User ID to send notification to
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
     * Additional notification metadata
     */
    metadata?: (Record<string, any> | null);
};

