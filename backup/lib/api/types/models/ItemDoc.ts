/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemMetadata } from './ItemMetadata';
import type { LinkInfoWithMetadata } from './LinkInfoWithMetadata';
/**
 * ## Description
 * Base model for item
 *
 * ## Fields
 * - links: List of link information other than sale information
 * - metadata: Metadata of the item
 * - like: Number of likes
 * - is_decoded: Whether the item is decoded
 */
export type ItemDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    requester: string;
    requested_at?: (string | null);
    links?: (Array<LinkInfoWithMetadata> | null);
    metadata?: ItemMetadata;
    img_url?: (string | null);
    like?: number;
    created_at?: string;
};

