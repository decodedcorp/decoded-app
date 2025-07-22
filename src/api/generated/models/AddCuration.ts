/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * :field content_type: `type` of this content(required)
 * :field curation_type: `type` of this curation(required)
 * :field title: `title` of this content(required)
 * :field description: `description of this content(optional)
 * :field sub_image_url: `sub` image of this content
 * :field docs: List of image document IDs
 */
export type AddCuration = {
    content_type: string;
    curation_type: string;
    title: string;
    sub_title?: (string | null);
    description: (string | null);
    sub_image_base64: (string | null);
    docs: Array<string>;
};

