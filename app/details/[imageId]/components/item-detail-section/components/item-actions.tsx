'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface ItemActionsProps {
  like: number;
}

export function ItemActions({ like }: ItemActionsProps) {
  return (
    <div className="flex items-center gap-2 mb-10">
      <Button 
        variant="outline" 
        className="px-5 py-2 rounded-full border-neutral-600 text-xs"
      >
        아이템 정보 제공
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center gap-1.5 px-3 py-2 rounded-full border-neutral-600 text-xs"
      >
        <Heart className="w-4 h-4" />
        <span>{like}</span>
      </Button>
    </div>
  );
} 