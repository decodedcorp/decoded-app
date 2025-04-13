export interface Position {
  top: string;
  left: string;
}

export interface RequestedItem {
  item_doc_id: string;
  item_img_url: string;
  position: Position;
}

export interface ImageDoc {
  _id: string;
  img_url: string;
  title?: string;
  requested_items: {
    [key: string]: RequestedItem[];
  };
}

export interface ItemDoc {
  _id: string;
  img_url: string;
  metadata?: {
    name: string;
  };
}
