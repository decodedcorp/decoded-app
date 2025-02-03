/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrandDoc } from './BrandDoc';
import type { CategoryDoc } from './CategoryDoc';
import type { IdentityDoc } from './IdentityDoc';
import type { ImageDoc } from './ImageDoc';
import type { ItemDoc } from './ItemDoc';
import type { NotificationDoc } from './NotificationDoc';
import type { RequestDoc } from './RequestDoc';
import type { SystemConfigDoc } from './SystemConfigDoc';
import type { TrendingDoc } from './TrendingDoc';
import type { UserDoc } from './UserDoc';
/**
 * General `GET` document response schema
 *
 * :field next_id: Id of the next page
 * :field docs: List of documents
 */
export type GetDocumentResponse = {
    docs?: (IdentityDoc | BrandDoc | ItemDoc | ImageDoc | UserDoc | RequestDoc | CategoryDoc | NotificationDoc | SystemConfigDoc | TrendingDoc | null);
    next_id?: (string | null);
    metadata?: (Record<string, any> | null);
};

