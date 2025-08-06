/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetUserProfile } from '../models/GetUserProfile';
import type { UpdateSettingsRequest } from '../models/UpdateSettingsRequest';
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
     * Update My Profile Settings
     * Update current user's profile settings
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateMyProfileSettingsUsersMeProfileSettingsPut(
        requestBody: UpdateSettingsRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/me/profile-settings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update My Sui Address
     * Update current user's SUI address
     * @param address
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateMySuiAddressUsersMeSuiAddressPatch(
        address: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/me/sui-address',
            query: {
                'address': address,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
