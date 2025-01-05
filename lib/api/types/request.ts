export interface RequestedItem {
  position: {
    top: string;
    left: string;
  };
  context?: string;
}

export interface RequestImage {
  requestedItems: RequestedItem[];
  requestBy: string;
  imageFile: string;
  metadata: Record<string, any>;
}

export interface APIResponse<T> {
  status_code: number;
  description: string;
  data: T;
} 