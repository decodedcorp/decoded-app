/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AIGenMetadataResponse } from './AIGenMetadataResponse';
import type { LinkPreviewMetadataResponse } from './LinkPreviewMetadataResponse';
export type LinkContentResponse = {
    id: string;
    channel_id: string;
    provider_id: string;
    url: string;
    category?: (string | null);
    link_preview_metadata?: (LinkPreviewMetadataResponse | null);
    ai_gen_metadata?: (AIGenMetadataResponse | null);
    created_at?: (string | null);
    updated_at?: (string | null);
};

