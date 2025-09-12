/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetUserProfile } from '../models/GetUserProfile';
import type { UpdateProfileRequest } from '../models/UpdateProfileRequest';
import type { UserActivityStatsResponse } from '../models/UserActivityStatsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get Profile
     * Get user profile - public endpoint with optional authentication
     * @param userId
     * @returns GetUserProfile Successful Response
     * @throws ApiError
     */
    public static getProfileUsersUserIdProfileGet(
        userId: string,
    ): CancelablePromise<GetUserProfile> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}/profile',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get My Profile
     * Get current user's profile
     * @returns GetUserProfile Successful Response
     * @throws ApiError
     */
    public static getMyProfileUsersMeProfileGet(): CancelablePromise<GetUserProfile> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/profile',
        });
    }
    /**
     * Update My Profile
     * Update current user's profile - partial update for aka, profile image, and/or SUI address
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateMyProfileUsersMeProfilePatch(
        requestBody: UpdateProfileRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/me/profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get My Activity Stats
     * Get current user's activity statistics
     * @returns UserActivityStatsResponse Successful Response
     * @throws ApiError
     */
    public static getMyActivityStatsUsersMeStatsGet(): CancelablePromise<UserActivityStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/stats',
        });
    }
    /**
     * Get User Activity Stats
     * Get user's public activity statistics
     * @param userId
     * @returns UserActivityStatsResponse Successful Response
     * @throws ApiError
     */
    public static getUserActivityStatsUsersUserIdStatsGet(
        userId: string,
    ): CancelablePromise<UserActivityStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}/stats',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
