export interface Activity {
  id: string;
  type: 'request';
  data: {
    image_url: string;
    image_doc_id: string;
    item_len: number;
  };
} 