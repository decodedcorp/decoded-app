'use client';

import { Point } from '@/types/model.d';
import { Input } from '@/components/ui/input';
import { useEffect, useRef } from 'react';
import { useLocaleContext } from '@/lib/contexts/locale-context';
interface MarkerInputProps {
  point: Point;
  onUpdateContext: (point: Point, context: string) => void;
  onSelect: (point: Point | null) => void;
}

export function MarkerInput({ point, onUpdateContext, onSelect }: MarkerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocaleContext();
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        defaultValue={point.context}
        placeholder={t.common.placeHolder.description}
        className="w-full bg-gray-900/60 border-gray-800 text-xs"
        onBlur={(e) => {
          onUpdateContext(point, e.target.value);
          onSelect(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
          if (e.key === 'Escape') {
            onSelect(null);
          }
        }}
      />
    </div>
  );
} 