/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LikeResponse } from './LikeResponse';
/**
 * Like list response
 */
export type LikeListResponse = {
    /**
     * List of likes
     */
    likes: Array<LikeResponse>;
    /**
     * Total number of likes
     */
    total_count?: number;
    /**
     * Whether more likes are available
     */
    has_more?: boolean;
};

