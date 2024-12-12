import { pretendardBold, pretendardRegular } from '@/lib/constants/fonts';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
  textColor?: 'white' | 'black';
}

export function SectionHeader({ 
  title, 
  subtitle, 
  className = "",
  textColor = 'white'
}: SectionHeaderProps) {
  const textColorClass = textColor === 'black' ? 'text-black' : 'text-white';
  
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <h2 className={`${pretendardBold.className} text-xl md:text-3xl ${textColorClass}`}>
        {title}
      </h2>
      <h3 className={`${pretendardRegular.className} mt-2 text-sm md:text-xl ${textColorClass}/80`}>
        {subtitle}
      </h3>
    </div>
  );
}