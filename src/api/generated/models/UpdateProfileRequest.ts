/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to update user profile - all fields optional for PATCH
 */
export type UpdateProfileRequest = {
    /**
     * User alias/nickname
     */
    aka: (string | null);
    /**
     * Base64 encoded profile image
     */
    base64_profile_image?: (string | null);
    /**
     * Sui blockchain address
     */
    sui_address?: (string | null);
};

