import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils/style';

interface ScrollRemoteProps {
  onScroll: (direction: 'left' | 'right' | 'up' | 'down') => void;
  className?: string;
}

export function ScrollRemote({ onScroll, className }: ScrollRemoteProps) {
  const scrollStep = 100; // 한 번에 이동할 픽셀 수

  const handleScroll = (direction: 'left' | 'right' | 'up' | 'down') => {
    onScroll(direction);
  };

  return (
    <div className={cn(
      'fixed bottom-8 right-8 bg-black/80 backdrop-blur-sm rounded-lg p-2 shadow-lg',
      'flex flex-col items-center gap-2',
      className
    )}>
      <button
        onClick={() => handleScroll('up')}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </button>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleScroll('left')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        
        <button
          onClick={() => handleScroll('right')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <button
        onClick={() => handleScroll('down')}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <ArrowDown className="w-5 h-5 text-white" />
      </button>
    </div>
  );
} 