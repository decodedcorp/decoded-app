/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VideoChapterResponse } from './VideoChapterResponse';
import type { VideoDetailsResponse } from './VideoDetailsResponse';
export type VideoContentResponse = {
    id: string;
    channel_id: string;
    provider_id: string;
    title: string;
    description?: (string | null);
    video_url: string;
    thumbnail_url?: (string | null);
    details?: (VideoDetailsResponse | null);
    chapters?: Array<VideoChapterResponse>;
    transcript?: (string | null);
    status: string;
    created_at?: (string | null);
    updated_at?: (string | null);
};

