/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategorySimpleItem } from './CategorySimpleItem';
/**
 * Simple category list response for frontend
 */
export type CategorySimpleListResponse = {
    /**
     * 카테고리 목록
     */
    categories: Array<CategorySimpleItem>;
    /**
     * 대분류 총 개수
     */
    total_count?: number;
};

