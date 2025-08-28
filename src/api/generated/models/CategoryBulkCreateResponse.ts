/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponse } from './CategoryResponse';
/**
 * Bulk category creation response
 */
export type CategoryBulkCreateResponse = {
    /**
     * Successfully created categories
     */
    created_categories: Array<CategoryResponse>;
    /**
     * Failed category creations with errors
     */
    failed_categories?: Array<Record<string, any>>;
    /**
     * Number of successfully created categories
     */
    total_created: number;
    /**
     * Number of failed category creations
     */
    total_failed: number;
};

