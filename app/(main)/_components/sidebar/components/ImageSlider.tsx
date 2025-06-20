import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  images: Array<{
    src: string;
    alt: string;
    title: string;
    subtitle: string;
  }>;
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [mainIndex, setMainIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMainIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  function handleSlideClick(e: React.MouseEvent<HTMLDivElement>) {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width / 2) {
      setMainIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setMainIndex((prev) => (prev + 1) % images.length);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setMainIndex((prev) => (prev + 1) % images.length);
      }, 3500);
    }
  }

  return (
    <div
      className="w-full flex justify-center items-center mb-6 relative cursor-pointer select-none"
      onClick={handleSlideClick}
      style={{ userSelect: 'none' }}
    >
      <Image
        src={images[mainIndex].src}
        alt={images[mainIndex].alt}
        width={480}
        height={270}
        className="rounded-xl object-cover w-[95%] max-w-2xl h-64 opacity-80"
        style={{ objectPosition: 'center top' }}
        priority
      />
      <div className="absolute bottom-4 left-8 transform translate-x-4">
        <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
          {images[mainIndex].title}
        </h3>
        <p className="text-sm text-white/90 font-medium drop-shadow-lg">
          {images[mainIndex].subtitle}
        </p>
      </div>
    </div>
  );
} 