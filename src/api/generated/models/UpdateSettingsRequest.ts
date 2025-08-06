/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to update user settings
 */
export type UpdateSettingsRequest = {
    /**
     * Base64 encoded profile image
     */
    profile_image_base64?: (string | null);
    /**
     * User alias/nickname
     */
    aka: (string | null);
    /**
     * Sui blockchain address
     */
    sui_address?: (string | null);
};

