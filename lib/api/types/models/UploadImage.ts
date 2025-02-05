/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageBase_Input } from './ImageBase_Input';
import type { InitialRequestedItem } from './InitialRequestedItem';
/**
 * ## Description
 * Schema for uploading image
 *
 * ## Fields
 * - `image_base`: Image base information
 * - `item_fields`: List of item fields to be requested(e.g ["name", "brand", "designed_by"])
 */
export type UploadImage = {
    image_base: ImageBase_Input;
    items_with_identity: Record<string, Array<InitialRequestedItem>>;
};

