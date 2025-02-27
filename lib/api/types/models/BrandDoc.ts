/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkInfo } from './LinkInfo';
export type BrandDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    name: Record<string, string>;
    logo_image_url?: (string | null);
    links?: (Array<LinkInfo> | null);
    created_at?: string;
};

