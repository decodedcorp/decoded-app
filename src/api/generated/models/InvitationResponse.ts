/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserProfileResponse } from './UserProfileResponse';
/**
 * Invitation response
 */
export type InvitationResponse = {
    /**
     * Invitation ID
     */
    id: string;
    /**
     * Channel ID
     */
    channel_id: string;
    /**
     * User who sent invitation
     */
    inviter: UserProfileResponse;
    /**
     * User who was invited
     */
    invitee: UserProfileResponse;
    /**
     * Personal message
     */
    message?: (string | null);
    /**
     * When invitation was created
     */
    created_at: string;
    /**
     * When invitation expires
     */
    expires_at: string;
    /**
     * Whether invitation has expired
     */
    is_expired: boolean;
};

