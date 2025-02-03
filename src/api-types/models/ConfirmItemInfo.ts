/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdditionalMetadata } from './AdditionalMetadata';
import type { LinkInfo } from './LinkInfo';
export type ConfirmItemInfo = {
    image_doc_id: string;
    base64_image?: (string | null);
    approve_urls?: (Array<LinkInfo> | null);
    reject_urls?: (Array<string> | null);
    additional_metadata?: (AdditionalMetadata | null);
};

