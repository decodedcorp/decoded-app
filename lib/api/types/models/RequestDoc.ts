/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrandBase } from './BrandBase';
import type { IdentityBase } from './IdentityBase';
import type { ImageBase_Output } from './ImageBase_Output';
export type RequestDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    request_by?: (string | null);
    doc_type: string;
    doc: (IdentityBase | ImageBase_Output | BrandBase);
    metadata?: (Record<string, any> | null);
    requested_at: string;
};

