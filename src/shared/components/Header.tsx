'use client';

import { useEffect, useState } from 'react';
import { LoginButton } from './LoginButton';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={
        'fixed top-0 left-0 w-full z-header transition-all duration-300 ' +
        (scrolled ? 'backdrop-blur bg-black/30' : 'bg-transparent')
      }
      style={{ WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div
        className="
          flex items-center justify-between
          w-full
          px-4 md:px-8
          h-[60px] md:h-[72px]
        "
      >
        {/* Logo */}
        <div className="text-2xl font-bold text-[#EAFD66] tracking-tight drop-shadow">decoded</div>
        {/* Login Button */}
        <LoginButton />
      </div>
    </header>
  );
}
