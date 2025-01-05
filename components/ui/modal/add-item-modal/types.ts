import { Point as BasePoint } from "@/types/model.d";

export interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestUrl: string;
  imageId: string;
  imageUrl: string;
  itemPositions: Array<{
    top: string;
    left: string;
  }>;
}

export interface ImageAreaProps {
  handleImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  imageUrl: string;
  itemPositions: Array<{
    top: string;
    left: string;
  }>;
  newMarkers: BasePoint[];
  setNewMarkers: React.Dispatch<React.SetStateAction<BasePoint[]>>;
}

export interface MarkersAreaProps {
  newMarkers: BasePoint[];
  setNewMarkers: React.Dispatch<React.SetStateAction<BasePoint[]>>;
}

export interface RequestButtonProps {
  newMarkers: BasePoint[];
  handleAdd: (markers: BasePoint[]) => void;
  image: {
    docId: string;
  };
  onClose?: () => void;
}

export interface Point extends BasePoint {
  top: string;
  left: string;
  context?: string;
} 