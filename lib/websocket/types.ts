export interface WebSocketMessage {
  type: 'request' | 'confirm_request_image';
  data: {
    image_url: string;
    image_doc_id: string;
    item_len: number;
    at?: string;
  };
  timestamp?: string;
}

export type WebSocketConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export interface WebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onStatusChange?: (status: WebSocketConnectionStatus) => void;
}

export interface AuthenticatedWebSocket extends WebSocket {
  isAuthenticated?: boolean;
}
