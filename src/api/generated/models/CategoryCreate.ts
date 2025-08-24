/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryType } from './CategoryType';
/**
 * Category creation request
 */
export type CategoryCreate = {
    /**
     * Category name
     */
    name: string;
    /**
     * Category type (channel/item)
     */
    category_type: CategoryType;
    /**
     * Parent category ID (null for top-level categories)
     */
    parent_category_id?: (string | null);
    /**
     * Display order for sorting
     */
    display_order?: number;
    /**
     * Category description
     */
    description: (string | null);
};

