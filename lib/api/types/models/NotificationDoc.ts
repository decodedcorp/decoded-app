/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationStatus } from './NotificationStatus';
import type { NotificationType } from './NotificationType';
export type NotificationDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    user_id: string;
    notification_type: NotificationType;
    title: string;
    content: string;
    metadata?: (Record<string, string> | null);
    status?: NotificationStatus;
    created_at?: string;
    read_at?: (string | null);
};

