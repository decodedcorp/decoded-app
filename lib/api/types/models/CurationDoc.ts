/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentType } from './ContentType';
import type { CurationType } from './CurationType';
import type { DetailPageCuration } from './DetailPageCuration';
import type { MainPageCuration } from './MainPageCuration';
export type CurationDoc = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    content_type: ContentType;
    curation_type: CurationType;
    contents?: (MainPageCuration | DetailPageCuration | null);
    created_at?: string;
    updated_at?: string;
};

