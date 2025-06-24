import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { ImageDetail } from '../../../_types/image-grid';
import { ItemMarker } from '../../image-action/ItemMarker';

interface ImageSliderProps {
  images: Array<{
    src: string;
    alt: string;
    title: string;
    subtitle: string;
  }>;
  imageDetail?: ImageDetail | null;
}

export function ImageSlider({ images, imageDetail }: ImageSliderProps) {
  const [mainIndex, setMainIndex] = useState(0);
  const [imageContainerSize, setImageContainerSize] = useState({ width: 0, height: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMainIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  useEffect(() => {
    const updateContainerSize = () => {
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        setImageContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    
    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

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
      <div 
        ref={imageContainerRef}
        className="relative w-[95%] max-w-2xl h-64 rounded-xl overflow-hidden"
      >
        <Image
          src={images[mainIndex].src}
          alt={images[mainIndex].alt}
          width={480}
          height={270}
          className="rounded-xl object-cover w-full h-full"
          style={{ objectPosition: 'center top' }}
          priority
        />
        
        {imageDetail && imageContainerSize.width > 0 && imageContainerSize.height > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {Object.values(imageDetail.items || {}).flat().map((decodedItem, idx) => (
              <ItemMarker
                key={`sidebar-marker-${decodedItem?.item?.item?._id || idx}`}
                decodedItem={decodedItem}
                itemContainerWidth={imageContainerSize.width}
                itemContainerHeight={imageContainerSize.height}
                detailDocId={imageDetail.doc_id}
                itemIndex={idx}
              />
            ))}
          </div>
        )}
      </div>
      
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