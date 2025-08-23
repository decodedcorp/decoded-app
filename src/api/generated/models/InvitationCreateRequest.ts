/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to create invitation
 */
export type InvitationCreateRequest = {
    /**
     * Channel ID to invite manager to
     */
    channel_id: string;
    /**
     * User ID to invite as manager
     */
    invitee_user_id: string;
    /**
     * Personal message to include with invitation
     */
    message?: (string | null);
    /**
     * Days until invitation expires
     */
    expires_in_days?: number;
};

