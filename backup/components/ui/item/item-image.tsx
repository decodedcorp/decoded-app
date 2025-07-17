import { cn } from "@/lib/utils/style";
import { ImagePlaceholder } from "@/components/ui/icons/image-placeholder";
import Image from "next/image";

interface ItemImageProps {
  imgUrl?: string | null;
  alt?: string;
  className?: string;
  imageClassName?: string;
  placeholderClassName?: string;
  width?: number;
  height?: number;
}

export function ItemImage({
  imgUrl,
  alt = "아이템 이미지",
  className,
  imageClassName,
  placeholderClassName,
  width,
  height,
}: ItemImageProps) {
  const containerClasses = cn(
    "bg-[#1A1A1A]/[0.5] rounded-lg overflow-hidden",
    className
  );

  if (!imgUrl) {
    return (
      <div className={containerClasses}>
        <div className="w-full h-full flex items-center justify-center">
          <ImagePlaceholder
            width={12}
            height={12}
            className={cn("text-gray-600", placeholderClassName)}
          />
        </div>
      </div>
    );
  }

  if (width && height) {
    return (
      <div className={containerClasses}>
        <Image
          src={imgUrl}
          alt={alt}
          width={width}
          height={height}
          className={cn("w-full h-full object-cover", imageClassName)}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <img
        src={imgUrl}
        alt={alt}
        className={cn("w-full h-full object-cover", imageClassName)}
      />
    </div>
  );
}
