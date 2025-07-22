'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function LoginButton() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = window.sessionStorage.getItem('ACCESS_TOKEN');
    setIsLogin(!!token);
  }, []);

  const handleClick = () => {
    if (isLogin) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded-md text-sm font-medium bg-neutral-900 text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black transition"
    >
      {isLogin ? '마이페이지' : '로그인'}
    </button>
  );
}
