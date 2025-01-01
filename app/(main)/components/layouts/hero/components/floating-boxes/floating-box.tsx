import { cn } from "@/lib/utils";
import { FloatingBoxProps } from "./types";

export function FloatingBox({ className, style, content, isLarge }: FloatingBoxProps) {
  return (
    <div className="relative">
      <div
        className={cn(
          isLarge ? 'w-[264px] h-[264px]' : 'w-[132px] h-[132px]',
          'bg-white/10 backdrop-blur-sm rounded-2xl',
          'flex flex-col items-center justify-center gap-2 p-4',
          'transform hover:scale-105 transition-transform duration-300',
          'border border-white/20',
          className
        )}
        style={style}
      >
        <span className={cn(
          "font-bold text-[#E2FF7D]",
          isLarge ? "text-5xl" : "text-3xl"
        )}>{content.icon}</span>
        <span className={cn(
          "font-bold text-white",
          isLarge ? "text-xl" : "text-base"
        )}>{content.title}</span>
      </div>
      {content.subtitle && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 mt-3 w-full text-center"
          style={{ top: '100%' }}
        >
          <span className={cn(
            "text-white/80",
            isLarge ? "text-base" : "text-sm"
          )}>{content.subtitle}</span>
        </div>
      )}
    </div>
  );
} 