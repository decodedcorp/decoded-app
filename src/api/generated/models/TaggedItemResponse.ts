/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemPositionResponse } from './ItemPositionResponse';
export type TaggedItemResponse = {
    id: string;
    item_category_id?: (string | null);
    metadata?: Record<string, any>;
    likes?: number;
    position: ItemPositionResponse;
    related_links?: Array<string>;
    item_img_url?: (string | null);
};

