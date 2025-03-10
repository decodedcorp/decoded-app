import Image from 'next/image';

interface BrandInfoProps {
  brandName: string | null;
  brandLogoUrl: string | null;
  isActive: boolean;
  position: 'default' | 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function BrandInfo({
  brandName,
  brandLogoUrl,
  isActive,
  position = 'default'
}: BrandInfoProps) {
  // 브랜드 정보가 없으면 렌더링하지 않음
  if (!brandName) return null;

  const positionClasses = {
    'default': 'bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom',
    'top': 'bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom',
    'bottom': 'top-full left-1/2 -translate-x-1/2 mt-2 origin-top',
    'left': 'right-full top-1/2 -translate-y-1/2 mr-2 origin-right',
    'right': 'left-full top-1/2 -translate-y-1/2 ml-2 origin-left',
    'top-right': 'bottom-0 left-4 mb-4 origin-bottom-left',
    'top-left': 'bottom-0 right-4 mb-4 origin-bottom-right',
    'bottom-right': 'top-0 left-4 mt-4 origin-top-left',
    'bottom-left': 'top-0 right-4 mt-4 origin-top-right'
  };

  const slideAnimations = {
    'default': 'scale-in-95',
    'top': 'scale-in-95',
    'bottom': 'scale-in-95',
    'left': 'scale-in-95',
    'right': 'scale-in-95',
    'top-right': 'scale-in-95',
    'top-left': 'scale-in-95',
    'bottom-right': 'scale-in-95',
    'bottom-left': 'scale-in-95'
  };

  return (
    <div 
      className={`
        absolute z-50
        ${positionClasses[position]}
        animate-in fade-in ${slideAnimations[position]}
        duration-200
      `}
    >
      <div
        className={`
          flex items-center gap-2 px-2.5 py-1.5 
          rounded-full bg-white/90 backdrop-blur-md
          shadow-sm
          transition-all duration-200
          ${isActive ? 'scale-105' : 'scale-100'}
        `}
      >
        <div className="relative w-4 h-4">
          <Image
            src={brandLogoUrl || "/placeholder.png"}
            alt={brandName || ""}
            fill
            className="object-cover rounded-full"
            unoptimized
          />
        </div>
        <span className="text-xs font-medium text-black whitespace-nowrap">
          {brandName}
        </span>
      </div>
    </div>
  );
}
