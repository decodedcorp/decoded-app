/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelResponse } from './ChannelResponse';
/**
 * Channel list response
 */
export type ChannelListResponse = {
    /**
     * List of channels
     */
    channels: Array<ChannelResponse>;
    /**
     * Total number of channels
     */
    total_count?: number;
    /**
     * Whether more channels are available
     */
    has_more?: boolean;
};

