/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RedisGetTrendingResult } from './RedisGetTrendingResult';
/**
 * Document for `trending` collection
 */
export type TrendingDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    timestamp?: string;
    images?: Array<RedisGetTrendingResult>;
    items?: Array<RedisGetTrendingResult>;
    keywords?: Array<RedisGetTrendingResult>;
};

