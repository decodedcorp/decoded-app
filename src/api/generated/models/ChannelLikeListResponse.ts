/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelLikeResponse } from './ChannelLikeResponse';
/**
 * Channel like list response
 */
export type ChannelLikeListResponse = {
    /**
     * List of channel likes
     */
    likes: Array<ChannelLikeResponse>;
    /**
     * Total number of likes
     */
    total_count?: number;
    /**
     * Whether more likes are available
     */
    has_more?: boolean;
};

