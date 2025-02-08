/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OGMetadata } from './OGMetadata';
import type { ReviewLinkMetadata } from './ReviewLinkMetadata';
import type { SaleLinkMetadata } from './SaleLinkMetadata';
/**
 * Link info with metadata
 *
 * :field og_metadata: OG metadata of the link
 * :field link_metadata: Metadata of the link
 * :field status: Status of the provided link
 */
export type LinkInfoWithMetadata = {
    url: string;
    label?: (string | null);
    date?: string;
    provider: string;
    og_metadata?: (OGMetadata | null);
    link_metadata?: (SaleLinkMetadata | ReviewLinkMetadata | null);
    status?: string;
};

