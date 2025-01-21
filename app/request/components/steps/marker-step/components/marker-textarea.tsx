'use client';

import { Point } from '@/types/model.d';

interface MarkerTextareaProps {
  point: Point;
  onUpdateContext: (point: Point, context: string) => void;
  onSelect: (point: Point | null) => void;
}

export function MarkerTextarea({ point, onUpdateContext, onSelect }: MarkerTextareaProps) {
  return (
    <div 
      className="pl-8 pr-2" 
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <textarea
        autoFocus
        className="w-full h-20 bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 placeholder-gray-600"
        placeholder="찾고 싶은 아이템에 대해 설명해주세요"
        value={point.context || ''}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onUpdateContext(point, e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSelect(null);
          }
          e.stopPropagation();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onBlur={(e) => e.stopPropagation()}
        ref={(textarea) => {
          if (textarea) {
            textarea.selectionStart = textarea.value.length;
            textarea.selectionEnd = textarea.value.length;
          }
        }}
      />
    </div>
  );
} 