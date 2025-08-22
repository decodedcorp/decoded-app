/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageContentResponse } from './ImageContentResponse';
import type { LinkContentResponse } from './LinkContentResponse';
import type { VideoContentResponse } from './VideoContentResponse';
export type SearchContentsResponse = {
    image?: Array<ImageContentResponse>;
    video?: Array<VideoContentResponse>;
    link?: Array<LinkContentResponse>;
};

