import { ReactNode, memo } from 'react';
import Image from 'next/image';

interface MainImageProps {
  imageUrl: string;
  onTouch: () => void;
  children: ReactNode;
}

function MainImageComponent({ imageUrl, onTouch, children }: MainImageProps) {
  return (
    <div className="relative aspect-[3/4]" onClick={onTouch}>
      <Image
        src={imageUrl}
        alt="Featured fashion"
        fill
        className="object-cover"
        priority
        sizes="650px"
      />
      <div className="absolute inset-0 z-10">
        {children}
      </div>
    </div>
  );
}

export const MainImage = memo(MainImageComponent); 