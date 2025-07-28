/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeedItemData } from './FeedItemData';
import type { FeedMetadata } from './FeedMetadata';
import type { FeedType } from './FeedType';
/**
 * Standard feed response
 */
export type FeedResponse = {
    /**
     * Feed items
     */
    items: Array<FeedItemData>;
    /**
     * Feed metadata
     */
    metadata: FeedMetadata;
    /**
     * Type of feed
     */
    feed_type: FeedType;
};

