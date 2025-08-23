/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvitationCreateRequest } from '../models/InvitationCreateRequest';
import type { InvitationListResponse } from '../models/InvitationListResponse';
import type { InvitationResponse } from '../models/InvitationResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvitationsService {
    /**
     * List Invitations
     * List invitations with pagination and filtering
     * @param page
     * @param limit
     * @param channelId
     * @param inviteeUserId
     * @param includeExpired
     * @returns InvitationListResponse Successful Response
     * @throws ApiError
     */
    public static listInvitationsInvitationsGet(
        page: number = 1,
        limit: number = 20,
        channelId?: string,
        inviteeUserId?: string,
        includeExpired: boolean = false,
    ): CancelablePromise<InvitationListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invitations/',
            query: {
                'page': page,
                'limit': limit,
                'channel_id': channelId,
                'invitee_user_id': inviteeUserId,
                'include_expired': includeExpired,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Invitation
     * Create a new invitation
     * @param requestBody
     * @returns InvitationResponse Successful Response
     * @throws ApiError
     */
    public static createInvitationInvitationsPost(
        requestBody: InvitationCreateRequest,
    ): CancelablePromise<InvitationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invitations/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Accept Invitation
     * Accept invitation
     * @param invitationId
     * @returns InvitationResponse Successful Response
     * @throws ApiError
     */
    public static acceptInvitationInvitationsInvitationIdAcceptPost(
        invitationId: string,
    ): CancelablePromise<InvitationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invitations/{invitation_id}/accept',
            path: {
                'invitation_id': invitationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reject Invitation
     * Reject invitation
     * @param invitationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rejectInvitationInvitationsInvitationIdRejectPost(
        invitationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invitations/{invitation_id}/reject',
            path: {
                'invitation_id': invitationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancel Invitation
     * Cancel invitation (inviter only)
     * @param invitationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static cancelInvitationInvitationsInvitationIdDelete(
        invitationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/invitations/{invitation_id}',
            path: {
                'invitation_id': invitationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
