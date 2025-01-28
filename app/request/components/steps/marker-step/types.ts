import { Point } from "@/types/model.d";

export interface MarkerStepClientProps {
  selectedImage: string | null;
  points: Point[];
  setPoints: (points: Point[]) => void;
}

export interface MarkerListProps {
  points: Point[];
  selectedPoint: Point | null;
  onSelect: (point: Point | null) => void;
  onUpdateContext: (point: Point, context: string | null) => void;
} 
