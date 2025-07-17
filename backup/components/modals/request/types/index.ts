import { Point } from "@/types/model.d";
import { StatusType, StatusMessageKey } from "@/components/ui/modal/status-modal";

export interface RequestFormModalProps {
  isOpen: boolean;
  modalType: "request" | "style";
  onClose: () => void;
}

export interface StylePoint extends Point {
  brand?: string;
  price?: string;
  isSecret?: boolean;
  context?: string;
}

export interface ContextAnswer {
  location: string;
  source?: string;
  inspirationLinks?: Array<{
    id: string;
    category: string;
    url: string;
  }>;
}

export interface ModalConfig {
  type: StatusType;
  isOpen: boolean;
  messageKey?: StatusMessageKey;
  onClose: () => void;
}

export interface ImageContainerProps {
  modalType: "request" | "style";
  step: number;
  selectedImage: string | null;
  imageFile: File | null;
  points: StylePoint[];
  onImageSelect: (image: string, file: File) => void;
  onPointsChange: (points: StylePoint[]) => void;
  onPointContextChange?: (point: Point, context: string | null) => void;
  onPointSelect: (pointIndex: number | null) => void;
  contextAnswers: ContextAnswer | null;
  selectedPoint: number | null;
  fullscreenMode: boolean;
  showCropper: boolean;
  onCropperChange: (show: boolean) => void;
  themeColor: string;
  isCroppingRef: React.MutableRefObject<boolean>;
  onPointRemove: (index: number) => void;
} 