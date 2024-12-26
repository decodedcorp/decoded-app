import Image from 'next/image';
import { ItemButtonProps } from '@/types/button.d';

export function InfoButton({ item, className }: ItemButtonProps) {
  return (
    <div className={`relative transition-transform duration-200 hover:scale-110 active:scale-95 ${className}`}>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/80 border border-white/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap">
        {item.info.imageUrl && (
          <div className="relative w-3.5 h-3.5 rounded-full overflow-hidden">
            <Image
              src={item.info.imageUrl}
              alt={item.info.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <span className="text-[10px] text-black/60 font-semibold">
          {item.info.brands?.[0].replace(/_/g, ' ').toUpperCase()}
        </span>
      </div>
      <div className="w-4 h-4 rounded-full border border-white/80 flex items-center justify-center group-hover:border-white/100 transition-colors duration-200">
        <div className="w-2 h-2 bg-white/80 rounded-full group-hover:bg-white/100 transition-colors duration-200" />
      </div>
    </div>
  );
} 