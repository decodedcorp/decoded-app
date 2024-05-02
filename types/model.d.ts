import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types";

export interface ImageDetail {
  id: string;
  name: string;
  taggedItem: TaggedItem[] | HoverItem[];
  tags: string[];
}

export interface TaggedItem {
  id: string;
  position: Position;
}

export interface Position {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

export interface ItemMetadata {
  id: string;
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
