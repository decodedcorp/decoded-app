/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubscriptionResponse } from './SubscriptionResponse';
/**
 * Subscription list response
 */
export type SubscriptionListResponse = {
    /**
     * List of subscriptions
     */
    subscriptions: Array<SubscriptionResponse>;
    /**
     * Total number of subscriptions
     */
    total_count?: number;
    /**
     * Whether more subscriptions are available
     */
    has_more?: boolean;
};

