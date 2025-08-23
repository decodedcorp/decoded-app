/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvitationResponse } from './InvitationResponse';
/**
 * Invitation list response
 */
export type InvitationListResponse = {
    /**
     * List of invitations
     */
    invitations: Array<InvitationResponse>;
    /**
     * Total number of invitations
     */
    total_count?: number;
    /**
     * Whether more invitations are available
     */
    has_more?: boolean;
};

