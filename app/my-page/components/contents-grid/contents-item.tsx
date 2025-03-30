import Image from 'next/image';

interface ContentsItemProps {
  height: number;
  imageUrl?: string;
  imageDocId?: string;
  title?: string;
}

export default function ContentsItem({ height, imageUrl, imageDocId, title }: ContentsItemProps) {
  // 4:5 비율에 맞는 너비 계산 (height * 0.8)
  const widthValue = Math.floor(height * 0.8);
  
  return (
    <div 
      className="rounded-lg overflow-hidden relative group"
      style={{ 
        height: `${height}px`,
        width: '100%'
      }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl} 
          alt={title || "이미지"} 
          width={widthValue}
          height={height}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ 
            objectFit: 'cover', 
            aspectRatio: '4/5'
          }}
          unoptimized={true}
        />
      ) : (
        <div className="bg-zinc-800 w-full h-full"></div>
      )}
      
      {/* 타이틀이 있는 경우 표시 */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white">
          <p className="text-sm truncate">{title}</p>
        </div>
      )}
      
      {/* 호버 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* 여기에 이미지에 대한 액션 버튼들 추가 가능 */}
        </div>
      </div>
    </div>
  );
} 