/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryTreeNode } from './CategoryTreeNode';
import type { CategoryType } from './CategoryType';
/**
 * Category tree response
 */
export type CategoryTreeResponse = {
    /**
     * Category tree structure
     */
    categories: Array<CategoryTreeNode>;
    /**
     * Category type
     */
    category_type: CategoryType;
    /**
     * Total number of categories in tree
     */
    total_count?: number;
};

