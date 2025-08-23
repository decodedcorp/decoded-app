/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PinTargetType } from './PinTargetType';
/**
 * Request to create a pin
 */
export type PinCreateRequest = {
    /**
     * Channel ID where pin will be created
     */
    channel_id: string;
    /**
     * Type of target to pin
     */
    target_type: PinTargetType;
    /**
     * ID of content or folder to pin
     */
    target_id: string;
    /**
     * Pin order (0 = first). If not provided, will be added at the end
     */
    pin_order?: (number | null);
    /**
     * Optional pin note
     */
    note?: (string | null);
};

