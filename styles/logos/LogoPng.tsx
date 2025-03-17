import Image from 'next/image';

interface LogoPngProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function LogoPng({ 
  className, 
  width = 120,
  height = 28,
  priority = false 
}: LogoPngProps) {
  return (
    <Image
      src="/images/decoded_transparency.png" 
      alt="DECODED Logo"
      width={width}
      height={height}
      priority={priority}   
      quality={90}
      className={className || "w-auto h-auto"}
    />
  );
} 