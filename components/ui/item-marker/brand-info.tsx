import Image from 'next/image';

interface BrandInfoProps {
  brandName: string | null;
  brandLogoUrl: string | null;
  isActive: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export function BrandInfo({
  brandName,
  brandLogoUrl,
  isActive,
  position,
}: BrandInfoProps) {
  const positionStyles = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  if (!brandName || !brandLogoUrl) return null;

  return (
    <div className={`absolute ${positionStyles[position]} whitespace-nowrap`}>
      <div
        className={`
        absolute -top-8 left-1/2 -translate-x-1/2 
        flex items-center gap-2 px-2.5 py-1.5 
        rounded-full bg-white/90 backdrop-blur-md
        shadow-sm
        transition-all duration-200
        ${isActive ? 'scale-105' : 'scale-100'}
      `}
      >
        <div className="relative w-4 h-4">
          <Image
            src={brandLogoUrl}
            alt={brandName}
            fill
            className="object-cover"
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
