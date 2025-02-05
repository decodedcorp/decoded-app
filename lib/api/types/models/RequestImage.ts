/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InitialRequestedItem } from './InitialRequestedItem';
export type RequestImage = {
    requested_items: Array<InitialRequestedItem>;
    request_by: string;
    context?: (string | null);
    source?: (string | null);
    image_file?: (string | null);
    metadata: Record<string, string>;
};

