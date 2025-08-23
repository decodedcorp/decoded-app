/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PinTargetType } from './PinTargetType';
/**
 * Pin response schema
 */
export type PinResponse = {
    /**
     * Pin ID
     */
    id: string;
    /**
     * Channel ID
     */
    channel_id: string;
    /**
     * User who created the pin
     */
    pinner_id: string;
    /**
     * Pin target type
     */
    pin_type: PinTargetType;
    /**
     * ID of pinned content or folder
     */
    target_id: string;
    /**
     * Pin order
     */
    pin_order: number;
    /**
     * Pin note
     */
    note?: (string | null);
    /**
     * Pin creation timestamp
     */
    pinned_at: string;
    /**
     * Pin last update timestamp
     */
    updated_at?: (string | null);
    /**
     * Name of pinned target
     */
    target_name?: (string | null);
    /**
     * Display type of target
     */
    target_type_display?: (string | null);
};

