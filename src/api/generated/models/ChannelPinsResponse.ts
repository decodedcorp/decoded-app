/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PinResponse } from './PinResponse';
/**
 * Channel pins list response
 */
export type ChannelPinsResponse = {
    /**
     * List of pins
     */
    pins: Array<PinResponse>;
    /**
     * Total number of pins
     */
    total_count?: number;
    /**
     * Whether more pins are available
     */
    has_more?: boolean;
};

