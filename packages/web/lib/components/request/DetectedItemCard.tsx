"use client";

import { memo, forwardRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Check,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  type DetectedSpot,
  type SpotSolutionData,
} from "@/lib/stores/requestStore";
import { SolutionInputForm } from "./SolutionInputForm";

interface DetectedItemCardProps {
  spot: DetectedSpot;
  isSelected: boolean;
  onClick: () => void;
  onAddSolution?: (spotId: string, solution: SpotSolutionData) => void;
  onUpdateSolution?: (
    spotId: string,
    index: number,
    solution: SpotSolutionData
  ) => void;
  onRemoveSolution?: (spotId: string, index: number) => void;
}

export const DetectedItemCard = memo(
  forwardRef<HTMLDivElement, DetectedItemCardProps>(
    (
      { spot, isSelected, onClick, onAddSolution, onUpdateSolution, onRemoveSolution },
      ref
    ) => {
      const [isAdding, setIsAdding] = useState(false);
      const [editingIndex, setEditingIndex] = useState<number | null>(null);
      const hasSolutions = spot.solutions.length > 0;

      const handleCardClick = useCallback(() => {
        onClick();
      }, [onClick]);

      const handleToggleAdd = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAdding((prev) => !prev);
        setEditingIndex(null);
      }, []);

      const handleStartEdit = useCallback(
        (e: React.MouseEvent, index: number) => {
          e.stopPropagation();
          setEditingIndex(index);
          setIsAdding(false);
        },
        []
      );

      const handleSaveNew = useCallback(
        (_spotId: string, solution: SpotSolutionData) => {
          onAddSolution?.(spot.id, solution);
          setIsAdding(false);
        },
        [onAddSolution, spot.id]
      );

      const handleSaveEdit = useCallback(
        (_spotId: string, solution: SpotSolutionData) => {
          if (editingIndex !== null) {
            onUpdateSolution?.(spot.id, editingIndex, solution);
          }
          setEditingIndex(null);
        },
        [onUpdateSolution, spot.id, editingIndex]
      );

      const handleRemove = useCallback(
        (e: React.MouseEvent, index: number) => {
          e.stopPropagation();
          onRemoveSolution?.(spot.id, index);
        },
        [onRemoveSolution, spot.id]
      );

      const handleCancelEdit = useCallback(() => {
        setIsAdding(false);
        setEditingIndex(null);
      }, []);

      return (
        <div
          ref={ref}
          className={`
            w-full text-left p-3 rounded-lg
            bg-card border transition-all duration-200
            ${
              isSelected
                ? "border-primary shadow-[0_0_8px_oklch(0.9519_0.1739_115.8446_/_0.5)]"
                : "border-border hover:border-primary/50"
            }
          `}
        >
          {/* Main Card Content - Clickable */}
          <button
            type="button"
            onClick={handleCardClick}
            className="w-full text-left"
            aria-pressed={isSelected}
          >
            <div className="flex gap-3 items-center">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0 w-14 h-14 rounded-md overflow-hidden bg-muted">
                {spot.imageUrl ? (
                  <Image
                    src={spot.imageUrl}
                    alt={spot.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No img
                  </div>
                )}
                {/* Index badge overlay */}
                <div
                  className={`
                    absolute top-0.5 left-0.5 w-5 h-5
                    flex items-center justify-center
                    rounded-full text-[10px] font-bold
                    ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/80 text-foreground border border-primary"
                    }
                  `}
                >
                  {spot.index}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Label + Brand */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  {spot.label && (
                    <span className="text-[10px] font-medium text-primary">
                      {spot.label}
                    </span>
                  )}
                  {spot.brand && (
                    <span className="text-[10px] text-muted-foreground">
                      {spot.brand}
                    </span>
                  )}
                  {hasSolutions && (
                    <span className="flex items-center gap-0.5 text-[10px] text-green-500">
                      <Check className="w-3 h-3" />
                      {spot.solutions.length}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-foreground truncate">
                  {spot.title}
                </h3>

                {/* Price or Confidence */}
                {spot.priceRange ? (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {spot.priceRange}
                  </p>
                ) : spot.confidence ? (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Detected: {Math.round(spot.confidence * 100)}%
                  </p>
                ) : null}
              </div>

              {/* Expand/Collapse Indicator */}
              {isSelected && (
                <div className="flex-shrink-0 text-muted-foreground">
                  {isAdding || editingIndex !== null ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              )}
            </div>
          </button>

          {/* Solutions List */}
          {isSelected && hasSolutions && editingIndex === null && !isAdding && (
            <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
              {spot.solutions.map((sol, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {sol.title}
                    </p>
                    {sol.priceAmount && (
                      <p className="text-xs text-muted-foreground">
                        {sol.priceAmount.toLocaleString()}{" "}
                        {sol.priceCurrency || "KRW"}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2 flex-shrink-0">
                    <a
                      href={sol.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleStartEdit(e, idx)}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, idx)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Solution Button */}
          {isSelected && editingIndex === null && !isAdding && (
            <button
              type="button"
              onClick={handleToggleAdd}
              className="mt-2 w-full py-2 text-sm text-primary border border-dashed border-primary/50
                         rounded-lg hover:bg-primary/5 transition-colors"
            >
              + 상품 정보 추가
            </button>
          )}

          {/* New Solution Form */}
          {isSelected && isAdding && (
            <SolutionInputForm
              spotId={spot.id}
              onSave={handleSaveNew}
              onCancel={handleCancelEdit}
            />
          )}

          {/* Edit Solution Form */}
          {isSelected && editingIndex !== null && (
            <SolutionInputForm
              spotId={spot.id}
              initialData={spot.solutions[editingIndex]}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          )}
        </div>
      );
    }
  )
);

DetectedItemCard.displayName = "DetectedItemCard";
