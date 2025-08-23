/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Content folder creation request
 */
export type ContentFolderCreate = {
    /**
     * Folder name
     */
    name: string;
    /**
     * Folder description
     */
    description: (string | null);
    /**
     * Channel ID where folder will be created
     */
    channel_id: string;
    /**
     * Parent folder ID for nested folders
     */
    parent_folder_id?: (string | null);
    /**
     * Folder color (hex code)
     */
    color?: (string | null);
};

