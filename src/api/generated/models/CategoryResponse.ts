/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryType } from './CategoryType';
/**
 * Category response schema
 */
export type CategoryResponse = {
    /**
     * Category ID
     */
    id: string;
    /**
     * Category name
     */
    name: string;
    /**
     * Category type
     */
    category_type: CategoryType;
    /**
     * Parent category ID
     */
    parent_category_id?: (string | null);
    /**
     * Display order
     */
    display_order?: number;
    /**
     * Whether category is active
     */
    is_active?: boolean;
    /**
     * Category description
     */
    description?: (string | null);
    /**
     * Creation timestamp
     */
    created_at: string;
    /**
     * Last update timestamp
     */
    updated_at?: (string | null);
    /**
     * Number of child categories
     */
    children_count?: number;
    /**
     * Number of items using this category
     */
    usage_count?: number;
};

