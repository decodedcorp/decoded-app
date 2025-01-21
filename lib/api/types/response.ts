export interface ApiResponse<T> {
  status_code: number;
  description: string;
  data: {
    image: T;
  };
} 