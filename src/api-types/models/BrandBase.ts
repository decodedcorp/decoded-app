/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkInfo } from './LinkInfo';
/**
 * ## Description
 * Base model for brand
 *
 * ## Fields
 * - `name`: name of the brand
 * - `logo_image_url`: logo image url of the brand
 * - `links`: links of the brand
 */
export type BrandBase = {
    name: Record<string, string>;
    logo_image_url?: (string | null);
    link_info?: (Array<LinkInfo> | null);
};

