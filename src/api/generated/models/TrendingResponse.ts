/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TrendingChannelItem } from './TrendingChannelItem';
import type { TrendingContentItem } from './TrendingContentItem';
/**
 * Trending response with both content and channels
 */
export type TrendingResponse = {
    /**
     * Trending content
     */
    content?: Array<TrendingContentItem>;
    /**
     * Trending channels
     */
    channels?: Array<TrendingChannelItem>;
    /**
     * Trending type (popular/trending)
     */
    type: string;
    /**
     * Items limit per category
     */
    limit: number;
    /**
     * Total content count
     */
    total_content?: number;
    /**
     * Total channels count
     */
    total_channels?: number;
    /**
     * Response generation timestamp
     */
    generated_at: string;
};

