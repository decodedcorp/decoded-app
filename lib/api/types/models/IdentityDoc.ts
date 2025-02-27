/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkInfo } from './LinkInfo';
export type IdentityDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    name: Record<string, string>;
    category?: (string | null);
    profile_image_url?: (string | null);
    links?: (Array<LinkInfo> | null);
    created_at?: string;
};

