import Image from 'next/image';
import { getProxiedImageUrl } from '@/lib/utils/imageProxy';

interface ProxiedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
}

/**
 * 외부 이미지를 안전하게 표시하는 컴포넌트
 * 외부 URL을 자동으로 프록시를 통해 로드합니다.
 */
export function ProxiedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  quality = 75,
  loading,
  onError,
  ...props
}: ProxiedImageProps) {
  // 외부 이미지 URL을 프록시 URL로 변환
  const proxiedSrc = getProxiedImageUrl(src);

  return (
    <Image
      src={proxiedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes={sizes}
      fill={fill}
      quality={quality}
      loading={loading}
      onError={onError}
      {...props}
    />
  );
}
