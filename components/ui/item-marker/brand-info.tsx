import Image from 'next/image';

interface BrandInfoProps {
  brandName: string | null;
  brandLogoUrl: string | null;
  isActive: boolean;
}

export function BrandInfo({
  brandName,
  brandLogoUrl,
  isActive,
}: BrandInfoProps) {
  if (!brandName || !brandLogoUrl) return null;

  return (
    <div
      className={`
      absolute -top-8 left-1/2 -translate-x-1/2 
      flex items-center gap-1.5 px-2 py-1 
      rounded-full bg-white/90 backdrop-blur-md
      shadow-sm
      transition-all duration-200
      ${isActive ? 'scale-105' : 'scale-100'}
    `}
    >
      <div className="relative w-3.5 h-3.5">
        <Image
          src={brandLogoUrl}
          alt={brandName}
          fill
          className="object-cover"
        />
      </div>
      <span className="text-[10px] font-medium text-black whitespace-nowrap">
        {brandName}
      </span>
    </div>
  );
}
