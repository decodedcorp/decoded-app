/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from './Category';
export type CategoryDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    item_class: string;
    depth?: number;
    inner?: (Array<Category> | null);
    last_updated?: string;
};

