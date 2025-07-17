interface Position {
  x: number;
  y: number;
}

interface Item {
  id: string;
  name: string;
  brand?: string;
  price?: number;
  url?: string;
}

interface PostItem {
  is_decoded: boolean;
  position: Position;
  item: Item;
}

interface PostMetadata {
  [key: string]: string | boolean | null;
  profile_image_url: string;
}

export interface Post {
  title: string | null;
  context: string | null;
  description: string;
  like: number;
  style: string | null;
  img_url: string;
  source: string | null;
  upload_by: string;
  doc_id: string;
  items: PostItem[];
  metadata: PostMetadata;
} 