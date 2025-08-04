/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaggedItemResponse } from './TaggedItemResponse';
export type ImageContentResponse = {
    id: string;
    channel_id: string;
    provider_id: string;
    url: string;
    status: string;
    likes?: number;
    tagged_items?: Array<TaggedItemResponse>;
    created_at?: (string | null);
    updated_at?: (string | null);
};

