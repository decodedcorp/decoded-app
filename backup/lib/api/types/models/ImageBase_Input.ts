/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InitialRequestedItem } from './InitialRequestedItem';
/**
 * Base model for image
 *
 * ## Fields
 * - context: Context of the image(e.g "New York Fashion Week")
 * - title: Title of the image(e.g "Runway 24SS")
 * - description: Description of the image(e.g "This image is about ..")
 * - like: Number of likes
 * - style: Style of the image(e.g "grunge", "bohemian")
 * - img_url: URL of the image
 * - source: Source of the image(e.g "vogue")
 * - upload_by: Uploader's doc_id(Mostly `user`)
 */
export type ImageBase_Input = {
    title?: (string | null);
    context?: (string | null);
    description?: (string | null);
    like?: number;
    style?: (Array<string> | null);
    img_url?: (string | null);
    source?: (string | null);
    upload_by?: (string | null);
    requested_items: Array<InitialRequestedItem>;
};

