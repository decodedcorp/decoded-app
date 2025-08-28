/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Category update request
 */
export type CategoryUpdate = {
    /**
     * Updated category name
     */
    name?: (string | null);
    /**
     * Updated parent category ID
     */
    parent_category_id?: (string | null);
    /**
     * Updated display order
     */
    display_order?: (number | null);
    /**
     * Updated active status
     */
    is_active?: (boolean | null);
    /**
     * Updated category description
     */
    description?: (string | null);
};

