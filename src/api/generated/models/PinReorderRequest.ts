/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to reorder pins
 */
export type PinReorderRequest = {
    /**
     * List of pin reorderings: [{'pin_id': str, 'new_order': int}]
     */
    pin_orders: Array<Record<string, any>>;
};

