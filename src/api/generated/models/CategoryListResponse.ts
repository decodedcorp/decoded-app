/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponse } from './CategoryResponse';
/**
 * Category list response
 */
export type CategoryListResponse = {
    /**
     * List of categories
     */
    categories: Array<CategoryResponse>;
    /**
     * Total number of categories
     */
    total_count?: number;
    /**
     * Whether more categories are available
     */
    has_more?: boolean;
};

