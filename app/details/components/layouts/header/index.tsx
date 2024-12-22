import { Button } from '@/components/ui/Button';
import {
  pretendardBold,
  pretendardSemiBold,
  pretendardRegular,
} from '@/lib/constants/fonts';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Link from 'next/link';

interface HeaderProps {
  title: string | null;
  description: string | null;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <div className="flex flex-col items-center mb-16">
      <h1
        className={`${pretendardBold.className} text-2xl md:text-5xl text-white mb-6`}
        title={title ?? undefined}
      >
        뉴진스 다니엘 코디
      </h1>
      <p
        className={`${pretendardRegular.className} text-md md:text-lg text-white/50 max-w-[60%] line-clamp-1 mb-6`}
        title={description ?? undefined}
      >
        {description}
      </p>
      {/* badge 컴포넌트 */}
      <button
        className={`w-fit m-2 p-2 text-sm 
            md:text-base cursor-pointer text-white hover:bg-white/10 transition-colors flex items-center gap-2 ${pretendardBold.className}`}
      >
        <Link
          href="/"
          className=" bg-white/20 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-sm md:text-base"
        ></Link>
        <p
          className={`${pretendardRegular.className} text-white/70 text-sm md:text-base`}
        >
          뉴진스_민지
        </p>
      </button>
    </div>
  );
}
