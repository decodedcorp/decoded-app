/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VideoChapterResponse } from './VideoChapterResponse';
export type VideoContentCreate = {
    channel_id: string;
    title: string;
    description?: (string | null);
    video_url: string;
    thumbnail_url?: (string | null);
    chapters?: Array<VideoChapterResponse>;
    transcript?: (string | null);
};

