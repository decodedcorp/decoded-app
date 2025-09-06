/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryBulkCreate } from '../models/CategoryBulkCreate';
import type { CategoryBulkCreateResponse } from '../models/CategoryBulkCreateResponse';
import type { CategoryCreate } from '../models/CategoryCreate';
import type { CategoryListResponse } from '../models/CategoryListResponse';
import type { CategoryResponse } from '../models/CategoryResponse';
import type { CategorySimpleListResponse } from '../models/CategorySimpleListResponse';
import type { CategoryTreeResponse } from '../models/CategoryTreeResponse';
import type { CategoryType } from '../models/CategoryType';
import type { CategoryUpdate } from '../models/CategoryUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
    /**
     * List Categories
     * List categories with pagination and filtering
     * @param page Page number
     * @param limit Items per page
     * @param categoryType Filter by category type
     * @param parentCategoryId Filter by parent category ID
     * @param isActive Filter by active status
     * @param search Search by name
     * @param sortBy Sort field
     * @param sortOrder Sort order
     * @returns CategoryListResponse Successful Response
     * @throws ApiError
     */
    public static listCategoriesCategoriesGet(
        page: number = 1,
        limit: number = 20,
        categoryType?: (CategoryType | null),
        parentCategoryId?: (string | null),
        isActive?: (boolean | null),
        search?: (string | null),
        sortBy: string = 'display_order',
        sortOrder: string = 'asc',
    ): CancelablePromise<CategoryListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/categories/',
            query: {
                'page': page,
                'limit': limit,
                'category_type': categoryType,
                'parent_category_id': parentCategoryId,
                'is_active': isActive,
                'search': search,
                'sort_by': sortBy,
                'sort_order': sortOrder,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Category
     * Create a new category (authenticated users only)
     * @param requestBody
     * @returns CategoryResponse Successful Response
     * @throws ApiError
     */
    public static createCategoryCategoriesPost(
        requestBody: CategoryCreate,
    ): CancelablePromise<CategoryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Category Tree
     * Get category tree structure
     * @param categoryType Category type for tree
     * @param isActive Filter by active status
     * @returns CategoryTreeResponse Successful Response
     * @throws ApiError
     */
    public static getCategoryTreeCategoriesTreeGet(
        categoryType: CategoryType,
        isActive?: (boolean | null),
    ): CancelablePromise<CategoryTreeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/categories/tree',
            query: {
                'category_type': categoryType,
                'is_active': isActive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Simple Categories
     * Get categories in simple format for frontend (대분류 + 서브카테고리 목록)
     * @param categoryType Category type for simple list
     * @returns CategorySimpleListResponse Successful Response
     * @throws ApiError
     */
    public static getSimpleCategoriesCategoriesSimpleGet(
        categoryType: CategoryType,
    ): CancelablePromise<CategorySimpleListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/categories/simple',
            query: {
                'category_type': categoryType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Bulk Create Categories
     * Bulk create categories (authenticated users only)
     * @param requestBody
     * @returns CategoryBulkCreateResponse Successful Response
     * @throws ApiError
     */
    public static bulkCreateCategoriesCategoriesBulkPost(
        requestBody: CategoryBulkCreate,
    ): CancelablePromise<CategoryBulkCreateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Seed Initial Categories
     * Seed initial categories (authenticated users only - consider adding admin check)
     * @returns CategoryBulkCreateResponse Successful Response
     * @throws ApiError
     */
    public static seedInitialCategoriesCategoriesSeedPost(): CancelablePromise<CategoryBulkCreateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/seed',
        });
    }
    /**
     * Get Category
     * Get category information - public endpoint
     * @param categoryId
     * @returns CategoryResponse Successful Response
     * @throws ApiError
     */
    public static getCategoryCategoriesCategoryIdGet(
        categoryId: string,
    ): CancelablePromise<CategoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Category
     * Update category information (authenticated users only)
     * @param categoryId
     * @param requestBody
     * @returns CategoryResponse Successful Response
     * @throws ApiError
     */
    public static updateCategoryCategoriesCategoryIdPut(
        categoryId: string,
        requestBody: CategoryUpdate,
    ): CancelablePromise<CategoryResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Category
     * Delete category (authenticated users only)
     * @param categoryId
     * @returns void
     * @throws ApiError
     */
    public static deleteCategoryCategoriesCategoryIdDelete(
        categoryId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
