import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types";

export interface ImageDetail {
  name: string;
  taggedItem: TaggedItem[] | HoverItem[];
  updateAt: Date;
  tags: string[];
}

export interface TaggedItem {
  id: string; // Same as item doc id
  position: Position;
}

export interface Position {
  top?: string;
  left?: string;
}

export interface ItemMetadata {
  name: string;
  price: string;
  url: string;
  tags: string[];
}

export interface HoverItem {
  position: Position;
  metadata: ItemMetadata;
}

export enum ArticleType {
  Any = "C",
  Generate = "G",
}

export interface Article {
  article_type: ArticleType;
  src?: string;
  time: string;
  title: string;
  url: string;
}
