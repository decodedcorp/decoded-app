export interface RequestedItem {
  position: {
    top: string;
    left: string;
  };
  context?: string | null;
}

export interface RequestImage {
  requestedItems: Array<{
    context?: string | null;
    position: {
      left: string;
      top: string;
    };
  }>;
  image_file: string;
  request_by: string;
  context?: string | null;
  source?: string | null;
}

export interface APIResponse<T> {
  status_code: number;
  description: string;
  data: T;
} 