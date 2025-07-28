/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response for system configuration
 */
export type SystemConfigResponse = {
    /**
     * System configuration data
     */
    config: Record<string, any>;
    /**
     * Last update timestamp
     */
    last_updated: string;
    /**
     * Admin user ID who last updated the config
     */
    updated_by: string;
};

