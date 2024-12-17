'use client';

import Link from 'next/link';
import Image from 'next/image';
import white_logo from '@/public/brandings/logos/logo_white.png';

function Logo({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div className={`
      animate-fade-in
      transition-all duration-default ease-default
      ${isScrolled
        ? 'text-left pl-8'
        : 'text-center mt-8 md:p-2'}
    `}>
      <Link
        href="/"
        prefetch={false}
        className="inline-block"
      >
        <div
          className={`relative ${
            isScrolled
              ? 'w-[100px] h-[20px] md:w-[154px] md:h-[32px]'
              : 'w-[200px] h-[30px] md:w-[154px] md:h-[32px]'
          }`}
        >
          <Image
            src={white_logo}
            alt="logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </Link>
    </div>
  );
}

export default Logo;
