/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to update channel information
 */
export type ChannelUpdateRequest = {
    /**
     * Channel name
     */
    name: (string | null);
    /**
     * Channel description
     */
    description: (string | null);
    /**
     * Channel active status
     */
    is_active?: (boolean | null);
    /**
     * Admin notes for the channel
     */
    admin_notes: (string | null);
};

