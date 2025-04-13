/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RequestedItem } from "./RequestedItem";
export type ImageDoc = {
  /**
   * MongoDB document ObjectID
   */
  _id?: string | null;
  title?: string | null;
  context?: string | null;
  description?: string | null;
  like?: number;
  style?: Array<string> | null;
  img_url?: string | null;
  source?: string | null;
  upload_by?: string | null;
  created_at?: string;
  requested_items: Record<string, Array<RequestedItem>>;
};

export type HeroRequestedItem = RequestedItem & {
  item_img_url?: string | null;
};

export type HeroImageDoc = {
  _id?: string | null;
  img_url?: string | null;
  requested_items: Record<string, Array<HeroRequestedItem>>;
};
