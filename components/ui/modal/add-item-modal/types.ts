import { Point as BasePoint } from "@/types/model.d";
import { DecodedItem, ImageData } from '@/lib/api/types/image';

// 확장된 Point 타입
export interface Point extends BasePoint {
  top?: string | number;
  left?: string | number;
  context?: string;
}

// API 응답 타입
export interface APIResponse<T> {
  status_code: number;
  description: string;
  data: T;
}

// 이미지 상세 정보 응답 타입
export interface ImageDetailResponse {
  image: ImageData;
}

// 모달 Props 타입
export interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageId: string;
  requestUrl: string;
}

// ImageArea Props 타입
export interface ImageAreaProps {
  handleImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  imageUrl: string | undefined;
  itemPositions: Point[];
  newMarkers: Point[];
  setNewMarkers: React.Dispatch<React.SetStateAction<Point[]>>;
}

// MarkersArea Props 타입
export interface MarkersAreaProps {
  newMarkers: Point[];
  setNewMarkers: React.Dispatch<React.SetStateAction<Point[]>>;
}

// RequestButton Props 타입
export interface RequestButtonProps {
  newMarkers: Point[];
  handleAdd: (markers: Point[]) => void;
  image: {
    docId: string;
  };
  onClose?: () => void;
} 