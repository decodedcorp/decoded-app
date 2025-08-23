/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to pin/unpin folder
 */
export type FolderPinRequest = {
    /**
     * Whether to pin or unpin folder
     */
    is_pinned: boolean;
    /**
     * Pin order (0 = first)
     */
    pin_order?: (number | null);
};

