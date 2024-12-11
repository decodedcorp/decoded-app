'use client';

import Link from 'next/link';
import { pretendardSemiBold } from '@/lib/constants/fonts';

const headers: Record<string, string[]> = {
  home: [],
  artist: ['kpop', 'rapper', 'actor', 'model'],
  brand: ['luxury', 'streetwear'],
  explore: [],
};

interface MenuSectionProps {
  pathname: string;
  isScrolled: boolean;
}

function MenuSection({ pathname, isScrolled }: MenuSectionProps) {
  return (
    <nav className="flex justify-center w-full">
      <ul className={`flex items-center ${isScrolled ? 'gap-14' : 'gap-5'}`}>
        {Object.keys(headers).map((header) => (
          <li
            key={header}
            className={`list-none transition-all duration-100 ease-in-out hover:scale-100 ${
              header === 'home'
                ? pathname === '/'
                  ? 'text-white'
                  : 'text-white/50'
                : pathname.startsWith(`/${header}`)
                ? 'text-white'
                : 'text-white/50'
            }`}
          >
            <Link
              href={header === 'home' ? '/' : `/${header}`}
              prefetch={false}
              className={`${pretendardSemiBold.className} text-sm md:text-lg`}
            >
              {header.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MenuSection;
