import Link from 'next/link';
import { cn } from '@/lib/utils/style/index';
import LogoSvg from '@/public/brandings/logos/LogoSvg';

function Logo() {
  return (
    <div className="flex">
      <Link href="/" prefetch={false}>
        <LogoSvg fontSize={28} />
      </Link>
    </div>
  );
}

export default Logo;
