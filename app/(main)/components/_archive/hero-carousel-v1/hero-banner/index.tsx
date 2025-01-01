import Image from 'next/image';
import Link from 'next/link';

interface HeroBannerProps {
  imageUrl: string;
  category: string;
  title: string;
  docId: string;
  isActive: boolean;
}

export function HeroBanner({ 
  imageUrl, 
  category, 
  title, 
  docId, 
  isActive 
}: HeroBannerProps) {
  return (
    <div className={`flex flex-col md:flex-row items-center lg:p-4 ${
      isActive ? "opacity-100" : "opacity-20"
    }`}>
      <div className="relative w-[100vw] md:w-[90vw]">
        <div className="relative aspect-[3/4] lg:aspect-[16/9]">
          <Image
            src={imageUrl}
            alt="carousel image"
            fill
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
          <Link
            href={`/details?imageId=${docId}&imageUrl=${imageUrl}&isFeatured=yes`}
            className="absolute inset-x-0 bottom-0 p-4 text-white z-10 text-center hover:underline"
          >
            <h1 className="text-xl font-bold mb-2">{category.toUpperCase()}</h1>
            <h2 className="text-4xl font-bold mb-10">{title}</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}