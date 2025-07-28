/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response for feed health check
 */
export type FeedHealthResponse = {
    /**
     * Feed health status
     */
    status: string;
    /**
     * Last update timestamp
     */
    last_updated: string;
    /**
     * Health metrics
     */
    metrics?: Record<string, any>;
};

