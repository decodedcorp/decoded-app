import { pretendardBold, pretendardRegular } from '@/lib/constants/fonts';

interface FeaturedImageHeaderProps {
  title: string | null;
  description: string | null;
}

export function FeaturedImageHeader({ title, description }: FeaturedImageHeaderProps) {
  return (
    <div className="flex flex-col items-center p-10">
      <h1 className={`${pretendardBold.className} text-3xl md:text-5xl font-bold text-white mb-5`}>
        {title}
      </h1>
      <h2 className={`${pretendardRegular.className} text-md md:text-lg text-white px-5`}>
        {description}
      </h2>
    </div>
  );
} 