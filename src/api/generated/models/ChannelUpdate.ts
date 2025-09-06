/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Channel update request
 */
export type ChannelUpdate = {
    /**
     * Updated channel name
     */
    name?: (string | null);
    /**
     * Updated channel description
     */
    description?: (string | null);
    /**
     * Updated base64 encoded thumbnail image
     */
    thumbnail_base64?: (string | null);
    /**
     * Updated base64 encoded banner image
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

