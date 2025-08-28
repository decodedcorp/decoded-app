/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryType } from './CategoryType';
/**
 * Category tree node for hierarchical display
 */
export type CategoryTreeNode = {
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
     * Number of items using this category
     */
    usage_count?: number;
    /**
     * Child categories
     */
    children?: Array<CategoryTreeNode>;
};

