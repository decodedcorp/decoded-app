/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Collection } from './Collection';
import type { ImageBase_Output } from './ImageBase_Output';
export type RequestDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    request_by?: (string | null);
    collection: Collection;
    doc: ImageBase_Output;
    metadata?: (Record<string, any> | null);
    requested_at: string;
};

