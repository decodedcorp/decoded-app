export interface Activity {
  id: string;
  type: 'confirm_request_image';
  data: {
    image_url: string;
    image_doc_id: string;
    item_len: number;
    at: string;
  };
}

export interface WebSocketMessage {
  event?: string;
  data?: {
    doc_id?: string;
    img_url?: string;
    items?: Record<string, any[]>;
    type?: string;
    message?: string;
    timestamp?: string;
  };
  timestamp?: string;
  type?: string;
  action?: string;
  channel?: string;
  status?: 'success' | 'error';
  message?: string;
} 