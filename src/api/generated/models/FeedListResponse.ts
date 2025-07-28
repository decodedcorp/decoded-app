/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeedResponse } from './FeedResponse';
/**
 * Response for multiple feeds
 */
export type FeedListResponse = {
    /**
     * Recent feed
     */
    recent: FeedResponse;
    /**
     * Popular feed
     */
    popular: FeedResponse;
    /**
     * Trending feed
     */
    trending: FeedResponse;
};

