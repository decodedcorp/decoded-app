import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types";

export interface ImageDetail {
  title: string;
  artistName: string;
  taggedItem: TaggedItem[] | HoverItem[];
  updateAt: Date;
  description?: string;
  hyped: number;
  tags: string[];
}

export interface ArtistMetadata {
  name: string;
  group?: string;
  sns?: {
    platform: Platform;
    url: string;
  }[];
}

export interface GroupMetadata {
  name: string;
  sns: {
    platform: Platform;
    url: string;
  }[];
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
  brands: string[];
  price?: string;
  unit?: string;
  url?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface BrandMetadata {
  name: string;
  websiteUrl: string;
  logoUrl: string;
  sns: {
    platform: Platform;
    url: string;
  }[];
}

enum Platform {
  X = "X",
  TikTok = "TikTok",
  Instagram = "Instagram",
  LinkedIn = "LinkedIn",
  YouTube = "YouTube",
}

export interface HoverItem {
  position: Position;
  metadata: ItemMetadata;
}

export enum ArticleType {
  Any = "C",
  Generate = "G",
}

export interface MainImageDetail {
  title?: String;
  artistName: String;
  tags?: String[];
  description?: string;
  hyped?: number;
  itemMetadata?: ItemMetadata[];
}

export interface Article {
  article_type: ArticleType;
  src?: string;
  time: string;
  title: string;
  url: string;
}
