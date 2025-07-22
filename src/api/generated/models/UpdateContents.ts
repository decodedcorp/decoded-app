/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for updating the featured contents
 *
 * :field dcuration_doc_id: `id` of existed `curation` document
 */
export type UpdateContents = {
    content_type: string;
    curation_type: string;
    title: string;
    sub_title?: (string | null);
    description: (string | null);
    sub_image_base64: (string | null);
    docs: Array<string>;
    curation_doc_id: string;
};

