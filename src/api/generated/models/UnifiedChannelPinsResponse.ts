/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UnifiedPinnedItem } from './UnifiedPinnedItem';
/**
 * Unified channel pins response combining content and folders
 */
export type UnifiedChannelPinsResponse = {
    /**
     * List of pinned items
     */
    items: Array<UnifiedPinnedItem>;
    /**
     * Total number of pinned items
     */
    total_count?: number;
    /**
     * Whether more items are available
     */
    has_more?: boolean;
};

