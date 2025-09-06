/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Channel creation request
 */
export type ChannelCreate = {
    /**
     * Channel name
     */
    name: string;
    /**
     * Channel description
     */
    description: (string | null);
    /**
     * Base64 encoded thumbnail image
     */
    thumbnail_base64?: (string | null);
    /**
     * Base64 encoded banner image
     */
    banner_base64?: (string | null);
    /**
     * Category name (대분류)
     */
    category?: (string | null);
    /**
     * Subcategory name (서브카테고리)
     */
    subcategory?: (string | null);
};

