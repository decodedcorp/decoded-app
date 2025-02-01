import { Point as BasePoint } from "@/types/model.d";
import { DecodedItem } from '@/lib/api/types/image';
import type { APIResponse } from '@/lib/api/types/request';

// 확장된 Point 타입
export interface Point extends BasePoint {
  top?: string | number;
  left?: string | number;
  context?: string;
}

// 이미지 데이터 타입
export interface ImageData {
  context?: string | null;
  decoded_percent: number;
  description: string;
  doc_id: string;
  img_url: string;
  items: DecodedItem[];
  like: number;
  metadata: Record<string, string>;
  source: string | null;
  style: string | null;
  title: string | null;
  upload_by: string;
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